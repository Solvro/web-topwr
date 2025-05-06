/* eslint-disable @typescript-eslint/require-await */
import { fetchUtils } from "react-admin";
import type {
  CreateParams,
  CreateResult,
  DataProvider,
  DeleteParams,
  DeleteResult,
  GetListParams,
  GetListResult,
  Identifier,
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
    const { data, meta } = (await response.json) as {
      data: RecordType[];
      meta: { total: number };
    };

    return {
      data,
      total: meta.total,
    };
  },

  //   // get a single record by id
  //   getOne: (resource, parameters) => Promise,

  //   // get a list of records based on an array of ids
  //   getMany: (resource, parameters) => Promise,

  //   // get the records referenced to another record, e.g. comments for a post
  //   getManyReference: (resource, parameters) => Promise,

  // create a record
  //! works only for student_organizations (for now)
  create: async <
    ResultRecordType extends RaRecord = Omit<RaRecord, "id"> & {
      id: Identifier;
    },
  >(
    resource: string,
    parameters: CreateParams<{
      name?: string;
      description?: string;
      shortDescription?: string;
    }>,
  ): Promise<CreateResult<ResultRecordType>> => {
    if (API_URL == null) {
      throw new Error("API_URL is not defined");
    }

    // TODO: use actual data instead of placeholders
    //! some optional fields are not implemented
    const inputData = {
      name: parameters.data.name,
      description: parameters.data.description,
      shortDescription: parameters.data.shortDescription,
      coverPreview: false,
      source: "student_department",
      organizationType: "scientific_club",
      organizationStatus: "unknown",
    };

    const token: string = localStorage.getItem("token") ?? "";

    const url = `${API_URL}api/v1/${resource}/`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(inputData),
      //   credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const { data } = (await response.json()) as {
      data: ResultRecordType;
    };
    // eslint-disable-next-line no-console
    console.log(data);
    return { data };
  },

  //   // update a record based on a patch
  // //! not tested yet
  //   update: async <RecordType extends RaRecord>(
  //     resource: string,
  //     parameters: UpdateParams<RecordType>,
  //   ): Promise<UpdateResult<RecordType>> => {
  //     if (API_URL == null) {
  //       throw new Error("API_URL is not defined");
  //     }

  //     // eslint-disable-next-line no-console
  //     console.log(parameters.data);
  //     // eslint-disable-next-line no-console
  //     console.log(JSON.stringify(parameters.data));

  //     const token = localStorage.getItem("token");

  //     const url = `${API_URL}api/v1/${resource}/${String(parameters.id)}`;
  //     const response = await fetch(url, {
  //       method: "PATCH",
  //       body: JSON.stringify(parameters.data),
  //       //   credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     // eslint-disable-next-line no-console
  //     console.log(response, response.json);
  //     const data = await response.json();
  //     return { data };
  //   },

  //   // update a list of records based on an array of ids and a common patch
  //   updateMany: (resource, parameters) => Promise,

  // delete a record by id
  //! not implemented yet
  delete: async <RecordType extends RaRecord>(
    resource: string,
    parameters: DeleteParams<RecordType>,
  ): Promise<DeleteResult<RecordType>> => {
    // eslint-disable-next-line no-console
    console.log("data provider: deletion", resource, parameters);
    return { data: "not implemented" as unknown as RecordType };
  },

  //   // delete a list of records based on an array of ids
  //   deleteMany: (resource, parameters) => Promise,
};
