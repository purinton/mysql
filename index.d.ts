/**
 * TypeScript type definitions for the createDb function
 */
export interface CreateDbOptions {
    env?: Record<string, string>;
    mysqlLib?: any;
    logger?: any;
}

export function createDb(options?: CreateDbOptions): Promise<any>;
