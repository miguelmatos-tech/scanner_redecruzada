import { AnalysisResult } from "@/ai/analyze"

export function parseNfeXml(xmlString: string): AnalysisResult | null {
  // Ensure it's a Brazilian NF-e XML
  if (!xmlString.includes('<nfeProc') && !xmlString.includes('<infNFe')) {
    return null;
  }

  // Helper macro for extracting content of a specific tag
  const extract = (tag: string, source: string = xmlString) => {
    const match = source.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`));
    return match ? match[1].trim() : '';
  };

  // Find the exact "emit" (emissor) node to grab the right CNPJ and Nome
  const emitMatch = xmlString.match(/<emit>(.*?)<\/emit>/s);
  const emitXml = emitMatch ? emitMatch[1] : '';

  const emitNome = extract('xNome', emitXml);
  const emitCnpj = extract('CNPJ', emitXml);
  
  // Get Dates and Totals
  const dhEmi = extract('dhEmi') || extract('dEmi');
  const vNF = extract('vNF'); 
  const infAdic = extract('infCpl');
  
  const items: any[] = [];
  const detRegex = /<det nItem=".*?"[^>]*>(.*?)<\/det>/gs;
  let detMatch;
  while ((detMatch = detRegex.exec(xmlString)) !== null) {
    const detXml = detMatch[1];
    items.push({
      name: extract('xProd', detXml),
      total: parseFloat(extract('vProd', detXml) || "0") * 100, // Cents
    });
  }

  const output: Record<string, any> = {
    merchant: emitNome,
    total: vNF ? Math.round(parseFloat(vNF) * 100) : 0,
    issuedAt: dhEmi,
    items: items,
    note: infAdic
  };

  // Assign CNPJ explicitly if it was found
  if (emitCnpj) {
    output['CNPJ'] = emitCnpj;
  }

  return {
    output,
    tokensUsed: 0,
  };
}
