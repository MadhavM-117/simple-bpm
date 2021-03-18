import React, { ChangeEvent } from 'react';
import { Client, logger, Task, TaskService } from 'camunda-external-task-client-js';

import CamundaAPIs from './api/camunda';
import './App.css';

interface IProps {
  
}

interface IState {
  processState: 'pending' | 'running' | 'success' | 'failure';
  knowsReact: boolean;
  knowsJavascript: boolean;
  knowsJava: boolean;
  knowsPython: boolean;
  name?: string;
}

const camundaApis = new CamundaAPIs('http://localhost:8080/engine-rest');

class App extends React.Component<IProps, IState> {
  private client: Client;

  constructor(props:{}) {
    super(props);
    this.client = new Client({
      baseUrl: "http://localhost:8080/engine-rest", 
      use: logger 
    });
 
    this.state = {
      processState: 'pending', 
      knowsReact: false, 
      knowsJavascript: false, 
      knowsJava: false, 
      knowsPython: false
    }
  } 

  componentDidMount() {
    // this.client.subscribe("helloWorld", async function({task, taskService}) {
    //     console.log("processing task");
    //     setTimeout(async () => {
    //       console.log("processing finished")
  
    //       await taskService.complete(task);
    //     }, 5000);
    // });
  }

  private async handleTask({task, taskService}: {task: Task, taskService: TaskService}) {
    
  }

  private getCheckboxEventHandler(field: string) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const stateUpdate: any = {};
      stateUpdate[field] = e.target.checked;

      this.setState({
        ...stateUpdate
      });
    }
  }

  private handleApplicationSubmission = () => {
    const {
      knowsJava,
      knowsJavascript, 
      knowsPython, 
      knowsReact,
      name
    } = this.state;

    if (!name) {
      console.error("Enter name to proceed!");
      alert("Enter name to proceed!");
      return;
    }

    camundaApis.startProcess("process-developer", {
      variables: {
        "knowsReact": {
          value: knowsReact,
          type: "Boolean"
        }, 
        "knowsJavascript": {
          value: knowsJavascript, 
          type: "Boolean"
        }, 
        "knowsJava": {
          value: knowsJava,
          type: "Boolean"
        }, 
        "knowsPython": {
          value: knowsPython, 
          type: "Boolean"
        }, 
        "name": {
          value: name, 
          type: "String"
        }
      }, 
      withVariablesInReturn: true
    }).then((res) => {
      console.log("Process started successfully!", res);

      this.setState({ processState: "running"});
    })
  }

  public renderProcessStatus() {
    const { processState } = this.state;

    switch(processState) {
      case 'pending': return <div>Enter Details and Submit to proceed.</div>;
      case 'running': return <div>Your request is being processed. Please wait</div>;
      case 'success': return <div>Your application has been approved. You will be contacted directly, with further instructions on how to proceed.</div>
      
      default:
      case 'failure': return <div>Your application has been rejected. Thank you for your time.</div>
    }
  }

  public renderApplicationDetails() {
    const { knowsReact, knowsJavascript, knowsJava, knowsPython, name } = this.state;
    
    return (
      <>
        <div>
          <label>Do you know React?</label> 
          <input type="checkbox" name="knowsReact" checked={knowsReact} onChange={this.getCheckboxEventHandler('knowsReact')}/>
        </div>
        <div>
          <label>Do you know Javascript?</label> 
          <input type="checkbox" name="knowsJavascript" checked={knowsJavascript} onChange={this.getCheckboxEventHandler('knowsJavascript')}/>
        </div>
        <div>
          <label>Do you know Java?</label> 
          <input type="checkbox" name="knowsJava" checked={knowsJava} onChange={this.getCheckboxEventHandler('knowsJava')}/>
        </div>
        <div>
          <label>Do you know Python?</label> 
          <input type="checkbox" name="knowsPython" checked={knowsPython} onChange={this.getCheckboxEventHandler('knowsPython')}/>
        </div>
        <div>
          <label>Name: </label>
          <input type="textbox" name="name" value={name} onChange={(e) => this.setState({ name: e.target.value })}></input>
        </div>
        <br/>
        <div>
          <button onClick={this.handleApplicationSubmission}>Submit</button>
        </div>
      </>
    );
  }

  
  
  public render() {
    const { processState } = this.state;
    
    return (
      <>
        {this.renderProcessStatus()}
        {processState === 'pending' ? this.renderApplicationDetails() : <></>}
      </>
    );
  }
}

export default App;
