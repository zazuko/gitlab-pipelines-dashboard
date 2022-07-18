import { gitlabUrl } from './env';

const fetchAllPages = async (url: string, additionalParams?: string) => {
  const perPage = 50;
  let page = 1;

  let results: any[] = [];

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

const gitlabQuery = async (url: string, token: string, additionalParams?: string): Promise<{}> => {
  const base = (`${url}`.startsWith('http://') || `${url}`.startsWith('https://')) ? '' : `${gitlabUrl}/api`;
  const results = await fetchAllPages(
    `${base}${url}?access_token=${token}`,
    additionalParams,
  );
  return results;
};

export default gitlabQuery;
