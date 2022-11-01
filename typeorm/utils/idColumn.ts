import { TableColumnOptions } from "typeorm";

export const idColumn = (name='id'): TableColumnOptions => ({
    name: 'id',
    type: 'int',
    isPrimary: true,
    isGenerated: true,
    generationStrategy: 'increment'
})