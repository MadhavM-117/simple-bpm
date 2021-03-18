import axios from 'axios';

class CamundaAPIs {
  protected baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public startProcess(processId: string, request: any) {
    const processUrl = `${this.baseUrl}/process-definition/key/${processId}/start`;

    return axios.post(processUrl, request).catch((err) => {
      console.error("There was an error while starting the process.", err);
      throw err;
    });
  }
}

export default CamundaAPIs;