import { gitlabUrl } from './env';

const fetchAllPages = async <T>(url: string, additionalParams?: string): Promise<T[]> => {
  const perPage = 50;
  let page = 1;

  let results: T[] = [];

  let params = '';
  if (additionalParams) {
    params = `&${additionalParams}`;
  }

  while (true) {
    const request = await fetch(`${url}&per_page=${perPage}&page=${page}${params}`);
    try {
      const json = await request.json();
      if (json.length && json.length > 0) {
        results = [...results, ...json];
        page = page + 1;
      } else {
        break;
      }

      if (json.length < perPage) {
        break;
      }
    } catch (e) {
      console.error(e);
      break;
    }
  }

  return results;
}

const gitlabQuery = async <T>(url: string, token: string, additionalParams?: string): Promise<T[]> => {
  const base = (`${url}`.startsWith('http://') || `${url}`.startsWith('https://')) ? '' : `${gitlabUrl}/api`;
  const results = await fetchAllPages<T>(
    `${base}${url}?access_token=${token}`,
    additionalParams,
  );
  return results;
};

export default gitlabQuery;
