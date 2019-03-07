import React, {Component} from 'react';
import ViewEdit from './ViewEdit';

class Table extends Component {
    constructor(){
        super();
        this.state = {
            edited: {
                rowIndex: null,
                colIndex: null
            }
        };
    }
    //------------------------------------------------------ Functions
    switchToEdit = (rowIndex, colIndex) => {
        const employees = this.props.employees;
        if (rowIndex === this.props.employees.length) {
            employees[rowIndex] = JSON.parse(JSON.stringify(employees[0]));
            for (let index in employees[rowIndex]) {
                employees[rowIndex][index] = null
            }
            employees[rowIndex][colIndex] = '';
        }
        this.setState({edited: {rowIndex, colIndex}});
    };
    onValidateUpdate = (rowIndex, colIndex, value, added) => {
        const employees = this.props.employees;
        if (added) {
            employees[rowIndex] = {};
            employees[rowIndex][colIndex] = value;
            this.props.createPost(employees[rowIndex]);
            this.setState({edited: {rowIndex: null, colIndex: null}});
        } else {
            employees[rowIndex][colIndex] = value;
            this.props.updatePost(employees[rowIndex]['id'], employees[rowIndex]);
            this.setState({edited: {rowIndex: null, colIndex: null}});
        }
    };
    onCancelUpdate = (rowIndex, colIndex, value, added) => {
        const employees = this.props.employees;
        if (added) {
            employees.splice(-1, 1);
            this.setState({edited: {rowIndex: null, colIndex: null}});
        } else {
            this.setState({ edited: {rowIndex: null, colIndex: null}});
        }
    };
    onValidateDelete = (row) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            this.props.deletePost(row['id']);
            this.setState({edited: {rowIndex: null, colIndex: null}});
        }
    };
    renderTable = () => {
        if (!this.props.employees.length) {
            return null;
        }
        const colNamesArr = [];
        Object.keys(this.props.employees[0]).forEach((element) => {
            colNamesArr.push(element);
        });
        const headTR = (
            <tr key="columns">
                {colNamesArr.map((value, index) => {
                    if (index !== 0) {
                        return (<td key={value}>{value}</td>);
                    }
                    return null;
                })}
                <td className="deleteTD" key="delete"></td>
            </tr>
        );
        const bodyTR = this.props.employees.map((row, rowIndex) => {
            const colValuesArr = [];
            Object.keys(row).forEach((element) => {
                colValuesArr.push(row[element]);
                return null;
            });
            return (
                <tr key={rowIndex}>
                    {colValuesArr.map((value, index) => {
                        if (index !== 0) {
                            let edit = false;
                            if (rowIndex === this.state.edited.rowIndex && colNamesArr[index] === this.state.edited.colIndex) {
                                edit = true;
                            }
                            let added = false;
                            if (colValuesArr[0] === null) {
                                added = true;
                                value = '';
                            }
                            if (colValuesArr[0] === null && colNamesArr[index] === this.state.edited.colIndex) {
                                added = true;
                                value = '';
                            }
                            return <ViewEdit
                                key={colNamesArr[index]}
                                edit={edit}
                                added={added}
                                rowIndex={rowIndex}
                                colIndex={colNamesArr[index]}
                                value={value}
                                switchToEdit={this.switchToEdit}
                                onValidateUpdate={this.onValidateUpdate}
                                onCancelUpdate={this.onCancelUpdate}
                            />;
                        }
                        return null;
                    })}
                    <td className="deleteTD" onClick={() => this.onValidateDelete(row)}>
                        <div className="buttton">&#10007;</div>
                    </td>
                </tr>
            );
        });
        const insert = colNamesArr.map((name, index) => {
            if (index !== 0) {
                let edit = true;
                if (this.state.edited.rowIndex === null) {
                    edit = false;
                    return <ViewEdit
                        key={index}
                        edit={edit}
                        added={true}
                        rowIndex={this.props.employees.length}
                        colIndex={colNamesArr[index]}
                        value="+"
                        switchToEdit={this.switchToEdit}
                        onValidateUpdate={this.onValidateUpdate}
                        onCancelUpdate={this.onCancelUpdate}
                    />;
                }
                return null;
            }
            return null;
        });
        return (
            <div className="database">
                <div className="databaseTitle"></div>
                <table>
                    <thead>
                    {headTR}
                    </thead>
                    <tbody>
                    {bodyTR}
                    <tr key="insert">
                        {insert}
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    };
    //------------------------------------------------------ Render
    render(){
        return this.renderTable();
    }
}


export default Table;