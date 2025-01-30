import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the original services.json file
const servicesPath = path.join(__dirname, "services.json");
const services = JSON.parse(fs.readFileSync(servicesPath, "utf-8"));

// Create new structure
const newServices = {};

// Create combined sets for our categories
const emailDomains = new Set();
const advertisingDomains = new Set();

// Categories to combine into Advertising
const advertisingCategories = [
  "Advertising",
  "FingerprintingInvasive",
  "FingerprintingGeneral",
  "Cryptomining",
  "Consent",
  "Content",
];

// Process each category
Object.entries(services.categories).forEach(([category, items]) => {
  const domains = new Set();

  // Loop through each service in the category
  items.forEach((serviceObj) => {
    // Each service object has a single key (service name) with value containing URLs
    const serviceName = Object.keys(serviceObj)[0];
    const serviceData = serviceObj[serviceName];

    // Get all domains from the service
    Object.values(serviceData).forEach((urlArray) => {
      if (Array.isArray(urlArray)) {
        urlArray.forEach((domain) => {
          domains.add(domain);
          // Add to appropriate combined set
          if (category === "Email" || category === "EmailAggressive") {
            emailDomains.add(domain);
          }
          if (advertisingCategories.includes(category)) {
            advertisingDomains.add(domain);
          }
        });
      }
    });
  });

  // Only add categories that aren't being combined
  if (
    category !== "Email" &&
    category !== "EmailAggressive" &&
    !advertisingCategories.includes(category)
  ) {
    newServices[category] = Array.from(domains);
  }
});

// Add the combined categories
newServices["Email"] = Array.from(emailDomains);
newServices["Advertising"] = Array.from(advertisingDomains);

// Create the new file with the original license and new structure
const newServicesJson = {
  license: services.license,
  categories: newServices,
};

// Write the new file
const outputPath = path.join(__dirname, "services.simplified.json");
fs.writeFileSync(outputPath, JSON.stringify(newServicesJson, null, 2));

console.log("Transformation complete! New file created at:", outputPath);
