import axios from "axios";
import { load, CheerioAPI } from "cheerio";

export type PostalDetail = { [key: string]: string };

const keys = ["province", "regency", "district", "village", "code"];

export const findByPostalCode = async (
  postalCode: number
): Promise<Array<PostalDetail>> => {
  const results: Array<PostalDetail> = [];
  const url = `https://direktorikodepos.org?s=${postalCode}`;
  const response = await axios.get(url);
  const $ = load(response.data);
  const tr = $("tr");

  if (!!tr.length) {
    return _mapResults($, results);
  }

  return results;
};

const _mapResults = (
  $: CheerioAPI,
  results: Array<PostalDetail>
): Array<PostalDetail> => {
  const tr = $("tr");
  tr.each((_, row) => {
    const td = $(row).find("td");
    const result: PostalDetail = {};

    td.each((index, col) => {
      const value = $(col).find("a").text().trim();
      const key = keys[index];
      result[key] = value;
    });

    if (Object.entries(result).length == 5) {
      results.push(result);
    }
  });
  return results;
};
