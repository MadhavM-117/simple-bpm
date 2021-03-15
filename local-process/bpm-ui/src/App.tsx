import React from 'react';
import { Client, logger } from 'camunda-external-task-client-js';
import './App.css';

interface IProps {
  
}

interface IState {
  processing: boolean;
}

class App extends React.Component<IProps, IState> {
  private client: Client;

  constructor(props:{}) {
    super(props);
    this.client = new Client({
      baseUrl: "http://localhost:8080/engine-rest", 
      use: logger 
    });
 

    
    this.state = {
     processing: false
    }
  } 

  componentDidMount() {
    this.client.subscribe("helloWorld", async function({task, taskService}) {
        console.log("processing task");
        setTimeout(async () => {
          console.log("processing finished")
  
          await taskService.complete(task);
        }, 5000);
    });
  }

  private async handleTask({task, taskService}: any) {
    
  }
  
  public render() {
    const { processing } = this.state;
    
    return (
      <>
        <div>Hello World</div>
        {processing ? <div>Processing is currently running...</div> : <></>}
      </>
    );
  }
}

export default App;
