
export interface httpClient  {
  fetch(
    url: string,
    options?: {
      method: string;
      body: string;
      headers: { "Content-Type": string };
    } 
  ): Promise<Response>;
};
