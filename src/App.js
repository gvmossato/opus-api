import './App.css';
import React from "react";

function TaskTable(props) {
  let { list, onDismiss, searchTerm} = props;
  console.log(list)
  if(!searchTerm){searchTerm = ""}
  return (
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Start Date</th>
            <th>Start Time</th>
            <th>End Date</th>
            <th>End Time</th>
            <th>All Day Event</th>
            <th>Description</th>
            <th>Location</th>
            <th>Private</th>
          </tr>
        </thead>
        <tbody>
          {list.filter(task => task.Subject.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((task) => (
            <tr key={task.id}>
              <td>{task.Subject}</td>
              <td>{task.Start_Date}</td>
              <td>{task.Start_Time}</td>
              <td>{task.End_Date}</td>
              <td>{task.End_Time}</td>
              <td>{task.All_Day_Event}</td>
              <td>{task.Description}</td>
              <td>{task.Location}</td>
              <td>{task.Private}</td>
              <td>
                <Button onClick={() => onDismiss(task.id)}>Excluir</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  );
}

function Search(props) {
  const {searchTerm, handleInputChange, children} = props;
  return (
      <form class='white-box'>
        {children} <input type="text" placeholder="Pesquise pelo nome da task"
          name="searchTerm" value={searchTerm} 
          onChange={(event) => handleInputChange(event)}/>
      </form>
    );
}

function Button(props) {
  const {
    onClick,
    className='',
    children,
  } = props;

  return (
    <button
      onClick={onClick}
      className={className}
      type="button"
      class="gradient-button primary-button"
    >
      {children}
    </button>
  );
}

// JSON to CSV Converter
// function ConvertToCSV(objArray) {
//   var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
//   console.log(array[0]);
//   var str = '';

//   for (var i = 0; i < array.length; i++) {
//       var line = '';
//       for (var index in array[i]) {
//           if (line != '') line += ','

//           line += array[i][index];
//       }

//       str += line + '\r\n';
//   }

//   return str;
// }

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { list: null };
  }
  
  onCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    console.log(array[0]);
    var str = '';

    for (var i = -1; i < array.length; i++) {
        var line = '';
        if (i!=-1){
        for (var index in array[i]) {
            if (index != 'id'){
              if (line != '') line += ','
              line += array[i][index];
            }
        }}
        else {
          line = 'Subject,Start Date,Start Time,End Date,End Time,All Day Event,Description,Location,Private'
        }

        str += line + '\r\n';
    }
    
    console.log(str)

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(str);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'output.csv';
    hiddenElement.click();
    return str;
  }

  onDismiss(id) {
    const updatedList = this.state.list.filter(item => item.id !== id);
    this.setState({ list: updatedList });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = 
      target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  componentDidMount() {
    fetch('http://127.0.0.1:8000/api/v1/appsite/')
      .then((response) => response.json())
      .then((result) => this.setState({ list: result }))
      .catch((error) => error);
  }

  render() {
    const {list, searchTerm} = this.state;

    if (!list) {
      return null;
    }
    
    return (
      <div className="App">
        <p><h2>Opus 2 Calendar</h2></p>
        <p class = 'search'>
        Pesquise uma task: 
        <Search
          searchTerm={searchTerm}
          handleInputChange={(e) => this.handleInputChange(e)}
        >
        </Search></p>
        { list ? (
          <TaskTable 
            list={list} 
            searchTerm={searchTerm}
            onDismiss={(id) => this.onDismiss(id)}
          />
        ) : null}
        <p><Button onClick={() => this.onCSV(list)}>Baixar CSV</Button></p>
      </div>
    );
  }
}

export default App;
