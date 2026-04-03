import { Database } from 'sqlite3';
import { SQLITE_PATH } from '../config';

export const db = new Database(SQLITE_PATH, (err) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  } else {
    console.log('Connected to the database');
  }
});

export const sqliteRun = (sql: string, params?: unknown[]): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (error: unknown, data: unknown) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

export const sqliteGet = (sql: string, params?: unknown[]): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error: unknown, data: unknown) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

export const sqliteAll = (sql: string, params?: unknown[]): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error: unknown, data: unknown) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};
