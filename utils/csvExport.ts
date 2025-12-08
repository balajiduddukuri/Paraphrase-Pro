/**
 * Detects if a string contains a Markdown table structure.
 * Looks for the characteristic header|header pattern followed by separator |---|---|
 */
export const hasMarkdownTable = (text: string): boolean => {
  return /\|.*\|\s*\n\s*\|[-:| ]+\|/.test(text);
};

/**
 * Parses the first Markdown table found in the text and converts it to CSV format.
 * CSV is natively supported by Excel.
 */
export const convertMarkdownTableToCSV = (text: string): string | null => {
  const lines = text.split('\n');
  const csvRows: string[] = [];
  let insideTable = false;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Check if line looks like a table row | ... |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      // Check if it's the separator row (e.g. |---|---|)
      // We skip this row in the CSV output
      if (/^\|[-:| ]+\|$/.test(trimmed)) {
        insideTable = true;
        continue;
      }
      
      // Extract content between pipes
      const rowContent = trimmed.slice(1, -1);
      
      // Split cells by pipe
      const cells = rowContent.split('|').map(cell => {
        let content = cell.trim();
        // Escape double quotes by doubling them (CSV standard)
        content = content.replace(/"/g, '""');
        // Wrap cell in quotes to handle commas, newlines, and existing quotes
        return `"${content}"`;
      });
      
      csvRows.push(cells.join(','));
      insideTable = true;
    } else if (insideTable) {
      // If we were inside a table and hit a non-table line, we stop.
      // This implementation extracts the first contiguous table block found.
      break; 
    }
  }

  return csvRows.length > 0 ? csvRows.join('\n') : null;
};

/**
 * Triggers a browser download for the CSV content.
 */
export const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
