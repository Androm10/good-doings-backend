import { Entity } from '../entities/entity';

export interface IRepository<T extends Entity> {
  get(id: number): Promise<T>;
  getAll(filter: any, limit?: number, page?: number): Promise<Paginated<T>>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: number, data: Partial<Omit<T, 'id'>>): Promise<T>;
  delete(id: number): Promise<boolean>;
}

export interface Paginated<T> {
  result: T[];
  limit: number;
  count: number;
  page: number;
  pages: number;
}
