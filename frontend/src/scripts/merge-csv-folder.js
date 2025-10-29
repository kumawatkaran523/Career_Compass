const fs = require("fs");
const path = require("path");

// Configuration - update this path to your folder
const CSV_FOLDER = "./Leetcode_questions_alltime"; // Or full path
const OUTPUT_JSON = "./src/data/problems-all.json";

// Parse CSV content
function parseCSV(content) {
  const lines = content.trim().split("\n");
  if (lines.length < 2) return [];

  // Get headers
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

  // Parse rows
  return lines
    .slice(1)
    .map((line) => {
      const values = [];
      let current = "";
      let inQuotes = false;

      
      // Create object
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = values[i] || "";
      });
      return obj;
    })
    .filter((row) => row.ID || row.id); // Only rows with ID
}

// Get company name from filename
function getCompanyName(filename) {
  return filename
    .replace("_alltime.csv", "")
    .replace(/-/g, " ")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Main merge function
function mergeAllCSVFiles() {
  console.log("🚀 Starting merge from folder...\n");
  console.log(`📂 Source folder: ${CSV_FOLDER}\n`);

  // Check if folder exists
  if (!fs.existsSync(CSV_FOLDER)) {
    console.error(`❌ Folder not found: ${CSV_FOLDER}`);
    console.log(
      "\n💡 Update the CSV_FOLDER path in the script to match your folder location"
    );
    process.exit(1);
  }

  // Get all CSV files
  const files = fs
    .readdirSync(CSV_FOLDER)
    .filter((f) => f.endsWith(".csv"))
    .sort();

  if (files.length === 0) {
    console.error("❌ No CSV files found in folder");
    process.exit(1);
  }

  console.log(`📊 Found ${files.length} CSV files\n`);

  const allProblems = new Map();
  const allCompanies = new Set();
  const stats = {
    totalFiles: files.length,
    processed: 0,
    failed: 0,
    totalEntries: 0,
  };

  // Process each file
  files.forEach((file, index) => {
    const companyName = getCompanyName(file);
    const filePath = path.join(CSV_FOLDER, file);

    process.stdout.write(
      `[${String(index + 1).padStart(3)}/${files.length}] ${companyName.padEnd(
        25
      )} `
    );

    try {
      const content = fs.readFileSync(filePath, "utf8");
      const data = parseCSV(content);

      if (data.length === 0) {
        console.log("⚠️  Empty file");
        stats.failed++;
        return;
      }

      allCompanies.add(companyName);
      let newProblems = 0;
      stats.totalEntries += data.length;

      // Process each problem
      data.forEach((row) => {
        const id = parseInt(row.ID || row.id);
        if (!id || isNaN(id)) return;

        const title = (row.Title || row.title || "").trim();
        if (!title) return;

        const difficulty = (
          row.Difficulty ||
          row.difficulty ||
          "Medium"
        ).trim();
        const acceptance = (
          row.Acceptance ||
          row.acceptance ||
          row["Acceptance Rate"] ||
          "N/A"
        ).trim();
        const frequency = parseFloat(row.Frequency || row.frequency || 0);

        if (!allProblems.has(id)) {
          // New problem
          allProblems.set(id, {
            id,
            title,
            difficulty: ["Easy", "Medium", "Hard"].includes(difficulty)
              ? difficulty
              : "Medium",
            acceptance: acceptance.includes("%")
              ? acceptance
              : `${acceptance}%`,
            frequency,
            leetcodeLink: `https://leetcode.com/problems/${title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")}/`,
            companies: [companyName],
            topics: [],
            solved: false,
          });
          newProblems++;
        } else {
          // Problem exists - add company
          const existing = allProblems.get(id);
          if (!existing.companies.includes(companyName)) {
            existing.companies.push(companyName);
          }
          // Keep highest frequency
          if (frequency > existing.frequency) {
            existing.frequency = frequency;
          }
        }
      });

      console.log(`✅ ${newProblems} new (${data.length} total)`);
      stats.processed++;
    } catch (error) {
      console.log(`❌ ${error.message}`);
      stats.failed++;
    }
  });

  // Sort problems by frequency
  const problemsArray = Array.from(allProblems.values())
    .map((p) => ({
      ...p,
      companies: p.companies.sort(),
    }))
    .sort((a, b) => b.frequency - a.frequency);

  // Create output
  const output = {
    problems: problemsArray,
    companies: Array.from(allCompanies).sort(),
    metadata: {
      total_problems: problemsArray.length,
      total_companies: allCompanies.size,
      total_entries: stats.totalEntries,
      last_updated: new Date().toISOString().split("T")[0],
      source:
        "Local CSV files (GitHub: krishnadey30/LeetCode-Questions-CompanyWise)",
      processed_files: stats.processed,
      failed_files: stats.failed,
    },
  };

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_JSON);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write to file
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(output, null, 2));

  // Print summary
  console.log("\n" + "=".repeat(70));
  console.log("✨ MERGE COMPLETE!\n");
  console.log(
    `📊 Unique Problems: ${output.metadata.total_problems.toLocaleString()}`
  );
  console.log(
    `📝 Total Entries: ${output.metadata.total_entries.toLocaleString()}`
  );
  console.log(`🏢 Companies: ${output.metadata.total_companies}`);
  console.log(`✅ Processed: ${stats.processed} files`);
  console.log(`❌ Failed: ${stats.failed} files`);
  console.log(`💾 Output: ${OUTPUT_JSON}`);

  const fileSize = fs.statSync(OUTPUT_JSON).size;
  console.log(`📦 File Size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

  // Company statistics
  const companyCounts = {};
  problemsArray.forEach((p) => {
    p.companies.forEach((c) => {
      companyCounts[c] = (companyCounts[c] || 0) + 1;
    });
  });

  console.log("\n📈 Top 15 Companies by Problem Count:");
  Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([company, count], i) => {
      const bar = "█".repeat(Math.ceil(count / 50));
      console.log(
        `  ${String(i + 1).padStart(2)}. ${company.padEnd(22)} ${count
          .toLocaleString()
          .padStart(5)} ${bar}`
      );
    });

  // Difficulty breakdown
  const difficultyCount = { Easy: 0, Medium: 0, Hard: 0 };
  problemsArray.forEach((p) => difficultyCount[p.difficulty]++);

  console.log("\n📊 Difficulty Distribution:");
  const total = problemsArray.length;
  console.log(
    `  🟢 Easy:   ${difficultyCount.Easy.toLocaleString().padStart(5)} (${(
      (difficultyCount.Easy / total) *
      100
    ).toFixed(1)}%)`
  );
  console.log(
    `  🟡 Medium: ${difficultyCount.Medium.toLocaleString().padStart(5)} (${(
      (difficultyCount.Medium / total) *
      100
    ).toFixed(1)}%)`
  );
  console.log(
    `  🔴 Hard:   ${difficultyCount.Hard.toLocaleString().padStart(5)} (${(
      (difficultyCount.Hard / total) *
      100
    ).toFixed(1)}%)`
  );

  // Most popular problems
  console.log("\n🔥 Top 10 Most Frequently Asked Problems:");
  problemsArray.slice(0, 10).forEach((p, i) => {
    const titleShort =
      p.title.length > 45 ? p.title.substring(0, 42) + "..." : p.title;
    console.log(
      `  ${String(i + 1).padStart(2)}. ${titleShort.padEnd(45)} (${
        p.companies.length
      } companies)`
    );
  });

  console.log("\n" + "=".repeat(70));
  console.log("\n✅ Your data is ready to use in the app!");
  console.log(
    `📝 Import it in your code: import problemsData from '${OUTPUT_JSON}';`
  );
}

// Run the merge
try {
  mergeAllCSVFiles();
} catch (error) {
  console.error("\n❌ Fatal error:", error.message);
  console.error(error.stack);
  process.exit(1);
}
