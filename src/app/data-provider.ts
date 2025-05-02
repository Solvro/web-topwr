import { fetchUtils } from "react-admin";
import type {
  DataProvider,
  GetListParams,
  GetListResult,
  RaRecord,
} from "react-admin";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// @ts-expect-error: partial implementation of DataProvider
export const dataProvider: DataProvider = {
  // get a list of records based on sort, filter, and pagination
  getList: async <RecordType extends RaRecord>(
    resource: string,
    parameters: GetListParams,
  ): Promise<GetListResult<RecordType>> => {
    const { page, perPage } = parameters.pagination ?? { page: 1, perPage: 10 };
    if (API_URL == null) {
      throw new Error("API_URL is not defined");
    }
    const url = `${API_URL}api/v1/${resource}?page=${String(page)}&limit=${String(perPage)}`;
    const response = await fetchUtils.fetchJson(url);
    const { data } = response.json as { data: RecordType[] };
    return {
      data,
      total: 250, //! placeholder, should be replaced with the actual total count
    };
  },

  //   // get a single record by id
  //   getOne: (resource, parameters) => Promise,

  //   // get a list of records based on an array of ids
  //   getMany: (resource, parameters) => Promise,

  //   // get the records referenced to another record, e.g. comments for a post
  //   getManyReference: (resource, parameters) => Promise,

  //   // create a record
  //   create: (resource, parameters) => Promise,

  //   // update a record based on a patch
  //   update: (resource, parameters) => Promise,

  //   // update a list of records based on an array of ids and a common patch
  //   updateMany: (resource, parameters) => Promise,

  //   // delete a record by id
  //   delete: (resource, parameters) => Promise,

  //   // delete a list of records based on an array of ids
  //   deleteMany: (resource, parameters) => Promise,
};
