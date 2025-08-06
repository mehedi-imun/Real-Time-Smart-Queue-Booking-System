/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { Query } from "mongoose";
import { excludeField } from "../constants";

export class QueryBuilder<T> {
  private modelQuery: Query<T[], T>;
  private queryParams: Record<string, string>;
  private filters: Record<string, unknown> = {};
  private defaultLimit = 10;

  constructor(modelQuery: Query<T[], T>, queryParams: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.queryParams = queryParams;
  }

  filter(): this {
    const queryCopy = { ...this.queryParams };

    for (const field of excludeField) {
      delete queryCopy[field];
    }

    // Direct filters (e.g., ?status=active&price=500)
    this.filters = { ...queryCopy };
    this.modelQuery = this.modelQuery.find(this.filters);

    return this;
  }

  search(fields: string[]): this {
    const searchTerm = this.queryParams.searchTerm?.trim();
    if (searchTerm && fields.length) {
      const regexQuery = {
        $or: fields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      };
      this.modelQuery = this.modelQuery.find(regexQuery);
    }
    return this;
  }

  sort(): this {
    const sortBy = this.queryParams.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  fields(): this {
    const fields = this.queryParams.fields?.split(",").join(" ");
    if (fields) {
      this.modelQuery = this.modelQuery.select(fields);
    }
    return this;
  }

  paginate(): this {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || this.defaultLimit;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  populate(fields: string | string[]): this {
    this.modelQuery = this.modelQuery.populate(fields);
    return this;
  }

  build(): Query<T[], T> {
    return this.modelQuery;
  }

  async getMeta(): Promise<{
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  }> {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || this.defaultLimit;

    const count = await this.modelQuery.model.countDocuments({
      ...this.filters,
      ...(this.queryParams.searchTerm
        ? {
            $or: Object.keys(this.filters).length
              ? []
              : this.modelQuery.getQuery().$or,
          }
        : {}),
    });

    const totalPage = Math.ceil(count / limit);

    return {
      page,
      limit,
      total: count,
      totalPage,
    };
  }
}
