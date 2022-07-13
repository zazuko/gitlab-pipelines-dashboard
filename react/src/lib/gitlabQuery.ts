import { gitlabUrl } from './env';

const gitlabQuery = async (url: string, token: string): Promise<{}> => {
  const request = await fetch(
    `${gitlabUrl}/api${url}?access_token=${token}`
  );
  return await request.json();
};

export default gitlabQuery;
