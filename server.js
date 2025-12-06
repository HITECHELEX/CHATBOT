// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// -------------------------------
// Enhanced productKnowledge
// -------------------------------
const productKnowledge = {
  companyInfo: {
    name: "HiTech Elex",
    description: "A company specializing in electrical monitoring and control systems for substations and industrial applications. We provide smart solutions for power utilities, industries, and infrastructure projects.",
    services: [
      "Electrical monitoring systems",
      "Control systems for substations",
      "Industrial automation solutions",
      "Predictive maintenance tools",
      "Energy data acquisition",
      "Product support and maintenance"
    ],
    contact: "Contact sales for detailed inquiries, quotations, and technical support"
  },

  products: {
    "automatic dehumidifier & temp controller": {
      key: "automatic dehumidifier & temp controller",
      aliases: ["adtc", "dehumidifier", "temp controller", "automatic dehumidifier", "humidity controller", "moisture controller", "panel dehumidifier"],
      relatedTerms: ["humidity", "moisture", "condensation", "flashover", "transformer box", "cable box", "mv panel", "peltier", "scada", "tank", "drain"],
      name: "HiTech Elex ADTC (Automatic Dehumidifier & Temp Controller)",
      price: "Contact for price",
      features: [
        "Peltier-based dehumidification (hot/cold sides) with internal fan",
        "Condensed-water drain / tank collection",
        "Automatic ON/OFF based on predefined humidity thresholds",
        "Quiet operation (no compressor)",
        "Optimizable sizing for confined spaces (TRF cable boxes, MV panels)",
        "Trend monitoring and SCADA connectivity via humidity/temperature sensors"
      ],
      description:
        "Compact Peltier dehumidifier and temperature controller designed to remove moisture from transformer cable boxes and MV panels; reduces flashovers and supports SCADA data logging and historical analysis.",
      applications: [
        "Transformer cable boxes",
        "MV (Medium Voltage) panels",
        "Switchgear compartments",
        "Control panels in humid environments"
      ],
      availability: "Contact sales"
    },

    "digital lightning arrester monitoring device": {
      key: "digital lightning arrester monitoring device",
      aliases: ["lamd", "arrester", "lightning arrester", "lightning arrester monitor", "la monitor", "surge arrester monitor", "leakage current monitor"],
      relatedTerms: ["lightning", "surge", "arrester", "leakage current", "resistive current", "surge count", "predictive maintenance", "scada", "modbus", "rs485"],
      name: "HiTech Elex LAMD (Digital Lightning Arrester Monitoring Device)",
      price: "Contact for price",
      features: [
        "Real-time measurement of total & resistive leakage current (Iₜ, Iᵣ)",
        "4-digit LED for leakage current, 6-digit LED for surge count",
        "Alarm notifications when thresholds exceeded",
        "Modbus RTU / RS-485 for SCADA integration",
        "IP65 enclosure, portable and maintenance-friendly",
        "Supports surge counting and trend analysis for predictive maintenance"
      ],
      description:
        "A compact monitoring unit for surge arresters that tracks leakage currents and surge counts, raises real-time alarms, integrates with SCADA, and enables predictive maintenance to prevent arrester failures.",
      applications: [
        "Surge arrester monitoring in substations",
        "Transmission line arresters",
        "Distribution line arresters",
        "Industrial surge protection systems"
      ],
      availability: "Contact sales"
    },
     "intelligent remote racking device": {
  key: "intelligent remote racking device",
  aliases: [
    "irrd",
    "remote racking device",
    "breaker racking system",
    "electrical racking",
    "remote vcb racking",
    "intelligent racking",
    "arc flash safe racking"
  ],
  relatedTerms: [
    "vcb",
    "vacuum circuit breaker",
    "arc flash",
    "racking mechanism",
    "torque limiting",
    "servo racking",
    "remote control",
    "breaker maintenance",
    "predictive diagnostics"
  ],
  name: "IRRD – Intelligent Remote Racking Device",
  price: "Contact for price",

  features: [
    "Remote breaker racking from outside the arc-flash zone",
    "Torque-limiting control with auto-trip protection to avoid mechanical damage",
    "Supports multiple breaker types with customizable configurations",
    "Continuous real-time position feedback during racking",
    "Wireless control up to 10 meters (as per brochure case study)",
    "Data logging of every racking operation for predictive maintenance",
    "Servo-controlled racking ensures smooth operation and reduces drive-box failures"
  ],

  description:
    "IRRD is a safety-focused intelligent racking solution that allows operators to rack breakers from a safe distance, eliminating arc flash exposure. Equipped with torque protection, position monitoring, and historical data logging, it enhances breaker reliability, ensures compliance with safety standards, and supports predictive diagnostics in substations and industrial switchgear environments.",

  applications: [
    "MV & HV switchgear breaker racking",
    "11kV & 33kV VCB feeder panels",
    "Hazardous-area racking in oil & gas industries",
    "Electrical substations and utility panels",
    "Industries requiring operator safety and predictive breaker maintenance"
  ],

  benefits: [
    "Protection from arc-flash by enabling remote operation",
    "Prevents breaker mechanical damage using torque control",
    "Wireless racking improves safety in gas-prone or hazardous areas",
    "Reduces maintenance downtime through smooth servo operation",
    "Historical racking data supports predictive maintenance planning",
    "Proven field performance (Tata Power, Oil & Gas sector case studies)"
  ],

  caseStudies: [
    {
      title: "Tata Power (Mumbai Division)",
      problem:
        "Manual racking of 11kV VCBs in confined switchgear rooms increased arc-flash exposure risk.",
      action:
        "IRRD deployed on all 11kV feeder panels for remote racking operations.",
      outcome: [
        "Breaker racking performed remotely outside arc-flash boundary",
        "28% reduction in breaker drive-box maintenance (due to servo-controlled movement)",
        "Adopted as a standard safety device across multiple substations"
      ]
    },
    {
      title: "Confidential – Oil & Gas Sector",
      problem:
        "Breakers located in hazardous areas created high arc-flash and safety risks due to limited PPE compliance.",
      action:
        "Wireless IRRD enabled remote racking from up to 10 meters via a handheld remote.",
      outcome: [
        "Racking performed without entering gas-prone area",
        "Passed internal safety audit with commendation",
        "22% reduction in breaker downtime",
        "₹4.5 lakh annual savings on PPE kits and risk allowances"
      ]
    }
  ],

  availability: "Contact sales"
}
,
    "panel health monitoring system": {
      key: "panel health monitoring system",
      aliases: ["phms", "panel monitor", "panel health", "panel monitoring system", "breaker monitor", "vacuum interrupter monitor", "i2t monitor"],
      relatedTerms: ["breaker", "circuit breaker", "vacuum interrupter", "i2t", "arcing", "trip coil", "close coil", "spring charging", "ct", "current transformer", "life estimation"],
      name: "PHMS V2.0 (Panel Health Monitoring System)",
      price: "Contact for price",
      features: [
        "Real-time monitoring of breaker parameters (I, I²t, arcing events)",
        "Vacuum interrupter life (I²t) tracking and remaining-life indication",
        "Monitoring of trip/close coils, spring charging motor, space heater",
        "T & RH (Temperature & Relative Humidity) sensor integration",
        "RS-485 Modbus RTU interface for SCADA",
        "Display + CT box (hollow hall-effect CT sensors), calibration routines",
        "Analytics, historical data, and predictive maintenance support"
      ],
      description:
        "Full-featured panel/breaker health monitoring system providing I²t-based life estimation, component health zones (green/yellow/red), SCADA integration (Modbus RTU), and on-device display and calibration tools.",
      applications: [
        "Circuit breaker panels in substations",
        "Industrial circuit breakers",
        "MV and HV switchgear panels",
        "Breaker maintenance planning"
      ],
      availability: "Contact sales"
    },

    "e-daq energy data acquisition": {
      key: "e-daq energy data acquisition",
      aliases: ["edaq", "e-daq", "daq", "energy data acquisition", "e daq", "energy logger", "meter data logger", "digital logbook"],
      relatedTerms: ["meter", "mfm", "abt meter", "energy audit", "data logging", "digital log", "substation automation", "energy report", "outage analysis"],
      name: "HiTech Elex e-DAQ (Energy Data Acquisition)",
      price: "Contact for price",
      features: [
        "Automatic data acquisition from various make MFM / ABT meters",
        "Digital logbook (auto-generated logs), min-max and hourly reports",
        "Energy audit & monthly progress reports",
        "Low-cost, local data storage optimized for long history (>10 years)",
        "Alarm generation and outage analysis",
        "Integration with third-party systems"
      ],
      description:
        "A low-cost, vendor-agnostic energy data-acquisition solution for substations — replaces manual log sheets with auto-generated digital logs and energy/audit reports and supports long-term historical data retention.",
      applications: [
        "Substation energy monitoring",
        "Industrial energy management",
        "Utility meter data collection",
        "Energy audit and reporting"
      ],
      availability: "Contact sales"
    },

    "feeder monitoring device": {
      key: "feeder monitoring device",
      aliases: ["fmd", "feeder device", "feeder monitor", "feeder monitoring", "breaker status monitor", "ground status monitor"],
      relatedTerms: ["feeder", "breaker status", "ground status", "isolated status", "panel mount", "potential free", "lv chamber", "status indicator"],
      name: "Feeder Monitoring Device (FMD)",
      price: "Contact for price",
      features: [
        "Displays feeder name, breaker status, ground status, isolated status",
        "Potential-free contact outputs to indicate statuses to LV chamber",
        "230 VAC power input, compact panel mount display",
        "Simple wiring: use potential free contacts for status monitoring",
        "Designed for continuous monitoring of breaker/ground/isolation status"
      ],
      description:
        "Panel-mounted indicator for feeder/breaker/ground/isolation statuses with potential-free outputs to integrate into LV chamber status logic.",
      applications: [
        "Feeder panels in substations",
        "Distribution panels",
        "Industrial power distribution",
        "Status monitoring in control rooms"
      ],
      availability: "Contact sales"
    }
  },

  faqs: [
    {
      question: "How does PHMS measure interrupter life?",
      answer: "PHMS calculates I²t from sampled arcing currents and counts to estimate consumed life and remaining life zones (green/yellow/red)."
    },
    {
      question: "Does PHMS require changes to existing wiring?",
      answer: "No. PHMS uses through-hole CT installation by passing existing current-carrying wire through hollow CT sensors; no major rewiring is required."
    },
    {
      question: "What communications does LAMD/PHMS support?",
      answer: "Modbus RTU over RS-485 (SCADA integration) with configurable Modbus ID and standard parameters."
    },
    {
      question: "What power supply do the PHMS and FMD require?",
      answer: "PHMS uses 24 VDC input for the controller/display module; FMD uses 230 VAC (see FMD brochure)."
    },
    {
      question: "What warranty / support is provided for PHMS?",
      answer: "Standard warranty listed in the PHMS manual: one-and-a-half year from supply and one year from commissioning (see manual)."
    },
    {
      question: "What does HiTech Elex do?",
      answer: "HiTech Elex specializes in electrical monitoring and control systems for substations and industrial applications, providing smart solutions for predictive maintenance, energy data acquisition, and automation."
    },
    {
      question: "How can I contact sales?",
      answer: "Please reach out to our sales team through the contact information provided on our website or company documentation."
    },
    {
      question: "Do you provide installation services?",
      answer: "Installation services availability depends on the product and location. Please contact sales for specific installation inquiries."
    },
    {
      question: "What industries do you serve?",
      answer: "We primarily serve power utilities, industrial plants, infrastructure projects, and any organization requiring electrical monitoring and control solutions."
    }
  ],

  promotions: [
    "Reduce flashover and moisture-related outages (ADTC) — proven in field case-studies.",
    "Remove recurring manual LCM testing and get real-time arrester health alarms (LAMD).",
    "Paperless substation logs and auto-generated energy audit reports (e-DAQ).",
    "Predictive, data-driven maintenance for breakers (PHMS) — I²t-based life monitoring."
  ]
};

// -------------------------------
// Enhanced Utilities
// -------------------------------
const lc = (s = "") => String(s).toLowerCase().trim();

function tokenize(text = "") {
  return text
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 0);
}

// Create search index for quick lookup
const createSearchIndex = () => {
  const index = {
    exactMatches: new Map(),
    partialMatches: new Map(),
    acronyms: new Map()
  };

  Object.values(productKnowledge.products).forEach(product => {
    // Add exact matches for keys and names
    index.exactMatches.set(lc(product.key), product);
    index.exactMatches.set(lc(product.name), product);
    
    // Add aliases
    product.aliases.forEach(alias => {
      index.exactMatches.set(lc(alias), product);
      // Store acronyms separately
      if (alias.length <= 4) {
        index.acronyms.set(lc(alias), product);
      }
    });
    
    // Add partial matches for related terms
    product.relatedTerms.forEach(term => {
      index.partialMatches.set(lc(term), product);
    });
    
    // Add product name words
    tokenize(product.name).forEach(word => {
      if (word.length > 3) {
        index.partialMatches.set(lc(word), product);
      }
    });
  });

  return index;
};

const searchIndex = createSearchIndex();

// -------------------------------
// Enhanced Matching and Classification Logic
// -------------------------------
function classifyQuery(message = "") {
  const text = lc(message);
  const tokens = tokenize(text);
  
  // General question patterns
  const generalPatterns = [
    /what (is|are|does|do)/i,
    /how (to|does|do|could|can)/i,
    /who (is|are)/i,
    /where (is|are|can)/i,
    /when (is|are|will)/i,
    /why (is|are|does)/i,
    /can you/i,
    /could you/i,
    /would you/i,
    /tell me about/i,
    /explain/i,
    /describe/i,
    /help me/i,
    /hi[te]*ch elex/i,
    /your company/i,
    /company info/i,
    /about (you|company)/i,
    /contact (you|sales)/i,
    /get in touch/i,
    /hello/i,
    /hi\b/i,
    /greetings/i
  ];
  
  // Product-specific patterns
  const productPatterns = [
    /(price|cost|how much)/i,
    /(feature|specification|spec)/i,
    /(application|use case)/i,
    /(brochure|manual|datasheet)/i,
    /(adtc|lamd|phms|edaq|fmd)/i,
    /(dehumidifier|arrester|monitor|panel|feeder)/i,
    /(order|buy|purchase|quote|quotation)/i,
    /(warranty|support|maintenance)/i
  ];
  
  let isGeneral = false;
  let isProduct = false;
  
  // Check for general patterns
  for (const pattern of generalPatterns) {
    if (pattern.test(text)) {
      isGeneral = true;
      break;
    }
  }
  
  // Check for product patterns
  for (const pattern of productPatterns) {
    if (pattern.test(text)) {
      isProduct = true;
      break;
    }
  }
  
  // Check exact product matches
  const hasExactProductMatch = Array.from(searchIndex.exactMatches.keys()).some(term => 
    text.includes(term)
  );
  
  if (hasExactProductMatch) {
    isProduct = true;
    isGeneral = false;
  }
  
  // If both flags are true, prioritize product
  if (isProduct && isGeneral) {
    isGeneral = false;
  }
  
  return {
    isGeneral,
    isProduct,
    type: isProduct ? 'product' : (isGeneral ? 'general' : 'unknown')
  };
}

function findProductMatch(message = "") {
  const text = lc(message);
  const tokens = tokenize(text);
  
  // 1. Check for exact matches
  for (const [term, product] of searchIndex.exactMatches) {
    if (text.includes(term)) {
      return product;
    }
  }
  
  // 2. Check for multi-word product mentions
  const productKeys = Object.keys(productKnowledge.products);
  for (const key of productKeys) {
    const keyWords = tokenize(key);
    const matchingWords = keyWords.filter(word => 
      tokens.includes(lc(word)) || text.includes(lc(word))
    );
    if (matchingWords.length >= Math.min(2, keyWords.length)) {
      return productKnowledge.products[key];
    }
  }
  
  // 3. Check for acronyms with context
  for (const [acronym, product] of searchIndex.acronyms) {
    if (tokens.includes(acronym)) {
      const contextWords = product.relatedTerms.map(lc);
      const hasContext = contextWords.some(word => text.includes(word));
      if (hasContext) {
        return product;
      }
    }
  }
  
  // 4. Check for related terms
  for (const [term, product] of searchIndex.partialMatches) {
    if (text.includes(term)) {
      const matchingTerms = product.relatedTerms.filter(relatedTerm => 
        text.includes(lc(relatedTerm))
      ).length;
      
      if (matchingTerms >= 2) {
        return product;
      }
    }
  }
  
  // 5. Check for FAQ matches
  for (const faq of productKnowledge.faqs) {
    if (text.includes(lc(faq.question.split(' ')[0])) || 
        text.includes(lc(faq.question.split(' ')[1]))) {
      // Find which product this FAQ relates to
      for (const product of Object.values(productKnowledge.products)) {
        if (faq.answer.toLowerCase().includes(product.key.split(' ')[0].toLowerCase())) {
          return { ...product, faq };
        }
      }
    }
  }

  return null;
}

// -------------------------------
// Enhanced Gemini Context
// -------------------------------
async function getEnhancedGeminiResponse(message, classification, matchedProduct = null) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    let systemPrompt = `You are a helpful assistant for HiTech Elex, a company specializing in electrical monitoring and control systems for substations and industrial applications.`;
    
    // Add company information for general questions
    systemPrompt += `\n\nCompany Information:
    Name: ${productKnowledge.companyInfo.name}
    Description: ${productKnowledge.companyInfo.description}
    Services: ${productKnowledge.companyInfo.services.join(', ')}
    Contact: ${productKnowledge.companyInfo.contact}`;
    
    // Add product catalog summary
    systemPrompt += `\n\nProduct Catalog Summary:`;
    Object.values(productKnowledge.products).forEach(product => {
      systemPrompt += `\n• ${product.name}: ${product.description.substring(0, 100)}...`;
    });
    
    if (classification.isProduct && matchedProduct) {
      systemPrompt += `\n\nThe user is asking about ${matchedProduct.name}. Here are the product details:
      Name: ${matchedProduct.name}
      Description: ${matchedProduct.description}
      Features: ${matchedProduct.features.join(', ')}
      Applications: ${matchedProduct.applications?.join(', ') || 'Various electrical monitoring applications'}
      Price/Availability: ${matchedProduct.availability}
      
      Please answer based on this product information. If the question is about specifications, features, applications, or pricing, use the information above.`;
    } else if (classification.isGeneral) {
      systemPrompt += `\n\nThe user is asking a general question about HiTech Elex or our services.`;
    }
    
    // Add FAQs for reference
    systemPrompt += `\n\nCommon FAQs (for reference):`;
    productKnowledge.faqs.slice(0, 5).forEach(faq => {
      systemPrompt += `\nQ: ${faq.question}\nA: ${faq.answer}`;
    });
    
    systemPrompt += `\n\nGuidelines for responses:
    1. Be helpful, professional, and concise
    2. If asked about pricing or quotations, direct to sales team
    3. If asked about specific products not in our catalog, politely explain we specialize in electrical monitoring systems
    4. For technical specifications beyond basic info, suggest contacting technical support
    5. Always maintain a positive and helpful tone
    6. If you don't know something, admit it and suggest contacting our team`;
    
    const fullPrompt = `${systemPrompt}\n\nUser question: ${message}\n\nAssistant:`;
    
    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini error:", error);
    return "I apologize, but I'm having trouble processing your request. Please try again or contact our sales team directly for assistance.";
  }
}

// -------------------------------
// Product endpoints
// -------------------------------
app.get("/api/products", (req, res) => {
  res.json({ 
    products: Object.values(productKnowledge.products).map(p => ({
      key: p.key,
      name: p.name,
      description: p.description,
      aliases: p.aliases,
      features: p.features.slice(0, 3)
    }))
  });
});

app.get("/api/products/:key", (req, res) => {
  const key = lc(req.params.key || "");
  const product = Object.values(productKnowledge.products).find(
    p => lc(p.key) === key || p.aliases.map(a => lc(a)).includes(key)
  );
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json({ product });
});

app.post("/api/products/search", (req, res) => {
  const q = lc(req.body.q || "");
  if (!q) return res.status(400).json({ error: "Missing search query 'q' in body" });

  const results = Object.values(productKnowledge.products).filter(p => {
    const searchableText = [
      p.key,
      p.name,
      p.description,
      p.features.join(' '),
      p.aliases.join(' '),
      p.relatedTerms?.join(' ') || '',
      p.applications?.join(' ') || ''
    ].join(' ').toLowerCase();
    
    return searchableText.includes(q);
  }).map(p => ({
    key: p.key,
    name: p.name,
    matchScore: calculateMatchScore(p, q),
    description: p.description.substring(0, 100) + '...'
  })).sort((a, b) => b.matchScore - a.matchScore);

  res.json({ results });
});

function calculateMatchScore(product, query) {
  let score = 0;
  const q = lc(query);
  
  if (lc(product.key).includes(q)) score += 100;
  if (lc(product.name).includes(q)) score += 90;
  if (product.aliases.some(alias => lc(alias) === q)) score += 80;
  if (product.aliases.some(alias => lc(alias).includes(q))) score += 60;
  if (lc(product.description).includes(q)) score += 50;
  if (product.features.some(f => lc(f).includes(q))) score += 40;
  if (product.relatedTerms?.some(t => lc(t).includes(q))) score += 30;
  
  return score;
}

// -------------------------------
// Enhanced Chat endpoint
// -------------------------------
app.post("/api/chat", async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message || typeof message !== "string") {
      return res.status(400).json({ 
        text: "Please provide a valid message.",
        source: "error" 
      });
    }

    // Classify the query
    const classification = classifyQuery(message);
    
    // Try to match a product
    const matchedProduct = findProductMatch(message);
    
    // Check for follow-up context
    let contextProduct = matchedProduct;
    if (!matchedProduct && conversationHistory.length > 0) {
      const lastMessages = conversationHistory.slice(-3).join(' ');
      contextProduct = findProductMatch(lastMessages);
    }

    // Get response from Gemini with context
    const geminiResponse = await getEnhancedGeminiResponse(
      message, 
      classification, 
      contextProduct || matchedProduct
    );

    // Prepare response
    const response = {
      source: classification.type === 'product' ? "productKnowledge+gemini" : "gemini",
      classification: classification.type,
      text: geminiResponse
    };

    // Add product info if matched
    if (matchedProduct) {
      response.product = {
        key: matchedProduct.key,
        name: matchedProduct.name,
        summary: matchedProduct.description.substring(0, 200) + '...'
      };
    }

    // Add company info for general questions
    if (classification.isGeneral && !matchedProduct) {
      response.companyInfo = {
        name: productKnowledge.companyInfo.name,
        description: productKnowledge.companyInfo.description.substring(0, 150) + '...'
      };
    }

    // Add FAQ suggestions if relevant
    if (classification.isGeneral || !matchedProduct) {
      const suggestedFAQs = productKnowledge.faqs
        .filter(faq => {
          const faqWords = tokenize(faq.question);
          return faqWords.some(word => 
            lc(message).includes(lc(word)) && word.length > 3
          );
        })
        .slice(0, 3);
      
      if (suggestedFAQs.length > 0) {
        response.suggestedFAQs = suggestedFAQs;
      }
    }

    res.json(response);
  } catch (error) {
    console.error("Chat endpoint error:", error);
    
    // Fallback response
    const classification = classifyQuery(req.body.message || "");
    const matchedProduct = findProductMatch(req.body.message || "");
    
    if (matchedProduct) {
      res.json({
        source: "fallback",
        text: `Based on your question about "${matchedProduct.name}", here's what I can tell you:\n\n${matchedProduct.description}\n\nKey Features:\n• ${matchedProduct.features.slice(0, 3).join('\n• ')}\n\nFor more details or pricing, please contact our sales team.`,
        product: {
          name: matchedProduct.name,
          key: matchedProduct.key
        }
      });
    } else if (classification.isGeneral) {
      res.json({
        source: "fallback",
        text: `Hi! I'm the HiTech Elex assistant. We specialize in electrical monitoring and control systems for substations and industrial applications. Our products include dehumidifiers, lightning arrester monitors, panel health systems, energy data acquisition, and feeder monitoring devices.\n\nHow can I help you today?`,
        classification: "general"
      });
    } else {
      res.status(500).json({ 
        text: "I apologize for the technical difficulty. Please rephrase your question or contact our sales team directly for assistance.",
        source: "error" 
      });
    }
  }
});

// -------------------------------
// Additional endpoints
// -------------------------------
app.get("/api/faqs", (req, res) => {
  res.json({ faqs: productKnowledge.faqs });
});

app.get("/api/company", (req, res) => {
  res.json({ company: productKnowledge.companyInfo });
});

app.get("/api/products/related/:key", (req, res) => {
  const key = lc(req.params.key || "");
  const product = productKnowledge.products[key];
  
  if (!product) return res.status(404).json({ error: "Product not found" });
  
  const related = Object.values(productKnowledge.products)
    .filter(p => p.key !== key)
    .map(p => {
      const sharedTerms = p.relatedTerms.filter(term => 
        product.relatedTerms.includes(term)
      ).length;
      return { ...p, relevance: sharedTerms };
    })
    .filter(p => p.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 2)
    .map(p => ({
      key: p.key,
      name: p.name,
      description: p.description.substring(0, 100) + '...'
    }));
  
  res.json({ product: product.name, related });
});

// -------------------------------
// New endpoint for general inquiries
// -------------------------------
app.post("/api/inquire", async (req, res) => {
  try {
    const { message, contactInfo } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    
    // This is a simplified version - in production, you might want to:
    // 1. Store inquiries in a database
    // 2. Send email notifications
    // 3. Integrate with CRM
    
    const inquiry = {
      message,
      contactInfo: contactInfo || "Not provided",
      timestamp: new Date().toISOString(),
      status: "received"
    };
    
    console.log("New inquiry received:", inquiry);
    
    res.json({
      success: true,
      message: "Your inquiry has been received. Our team will contact you shortly.",
      inquiryId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    });
  } catch (error) {
    console.error("Inquiry error:", error);
    res.status(500).json({ error: "Failed to process inquiry" });
  }
});

// -------------------------------
// Start server
// -------------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Available products: ${Object.keys(productKnowledge.products).join(', ')}`);
  console.log(`\nThe assistant can now handle:`);
  console.log(`• Product-specific questions (${Object.keys(productKnowledge.products).length} products)`);
  console.log(`• General company questions`);
  console.log(`• FAQ queries`);
  console.log(`• Inquiries through /api/inquire endpoint`);
});