import React from 'react';
import Table from './Table';
import './App.css';

const ROOT_URL = "http://localhost:8080";

class App extends React.Component {
    state = {
        employees: []
    };

    componentWillMount = () => {
        this.fetchPosts();
    };

    fetchPosts = () => {
        console.log('fetchPosts()');
        fetch(`${ROOT_URL}/api/employees`, {method: 'GET'})
            .then(response => response.json())
            .then(employees => this.setState({employees}))
    };

    fetchPost = (id ) => {
        console.log('fetchPost(id)');
        fetch(`${ROOT_URL}/api/employees/${id}`, {method: 'GET'})
            .then(response => response.json())
            .then(employees => this.setState({employees}))
    };

    createPost = (row ) => {
        console.log('createPost()');
        fetch(`${ROOT_URL}/api/employees/insert`, {
            method: 'POST',
            body: JSON.stringify(row),
            headers: {
                'Content-Type': 'application/json'
            }})
            .then(response => response.json())
            .then(employees => this.setState({employees}))
    };

    deletePost = (id ) => {
        console.log('deletePost()');
        console.log('id', id);
        fetch(`${ROOT_URL}/api/employees/${id}`, {method: 'DELETE'})
            .then(response => response.json())
            .then(employees => this.setState({employees}))
    };

    updatePost = (id, row ) => {
        console.log('updatePost()');
        fetch(`${ROOT_URL}/api/employees/${id}`, {
            method: 'PUT',
            body: JSON.stringify(row),
            headers: {
                'Content-Type': 'application/json'
            }
           })
            .then(response => response.json())
            .then(employees => this.setState({employees}))
    };

    render() {
        if(!this.state.employees){
            return null;
        }
        return (
            <div className="App">
                <h1>Plexxis Employees</h1>
                <Table
                    employees={this.state.employees}
                    fetchPost={this.fetchPost}
                    createPost={this.createPost}
                    deletePost={this.deletePost}
                    updatePost={this.updatePost}
                />
            </div>
        );
    }
}

export default App;
