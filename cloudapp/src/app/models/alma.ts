export interface CodeTable {
  row: CodeTableRow[]
}

export interface CodeTableRow {
  code: string;
  description: string;
  enabled: boolean;
}

export const sortCodeTable = (table: CodeTable) => {
  table.row.sort((a, b) => a.description.localeCompare(b.description, undefined, {sensitivity: 'base'}))
  return table;
}