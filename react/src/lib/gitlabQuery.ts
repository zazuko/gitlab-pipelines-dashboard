import { gitlabUrl } from './env';

const fetchAllPages = async (url: string) => {
  const perPage = 10;
  let page = 1;

  let results: any[] = [];

  while (true) {
    const request = await fetch(`${url}&per_page=${perPage}&page=${page}`);
    try {
      const json = await request.json();
      if (json.length && json.length > 0) {
        results = [...results, ...json];
        page = page + 1;
      } else {
        break;
      }
    } catch (e) {
      console.error(e);
      break;
    }
  }

  return results;
}

const gitlabQuery = async (url: string, token: string): Promise<{}> => {
  const results = await fetchAllPages(
    `${gitlabUrl}/api${url}?access_token=${token}`
  );
  return results;
};

export default gitlabQuery;
