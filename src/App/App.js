import React, { Component } from 'react';
import './App.css';
import ApiRequest from '../Util/Api';
import Loader from './Loader';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {value: '', gistList:[], loading: false};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value, noResult:false});
    }

    handleSubmit(event) {
        let self = this;
        self.setState({
            loading: true
        })
        ApiRequest({
            url: 'users/'+this.state.value+'/gists'
        }).then((gistList)=>{
            console.log(gistList);
            if (gistList.length) {
                self.setState({
                    gistList,
                    loading: false
                });
            } else {
                self.setState({
                    gistList: [],
                    noResult: true,
                    loading: false
                })
            }
        }).catch((err) => alert(err))
        event.preventDefault();
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome</h1>
                </header>
                <div className="search-tag">
                    <form onSubmit={this.handleSubmit}>
                        <input className="search-input" type="text" placeholder="Search Username" value={this.state.value} onChange={this.handleChange}/>
                        <input className="search-btn" type="submit" value="Submit" />
                    </form>
                    {this.state.loading && <Loader />}
                </div>
                <div className="list-display">
                    {this.state.gistList.length !==0  && <h4>Showing Results</h4>}
                    <ul className="list">
                        {
                            this.state.gistList.length !==0 && this.state.gistList.map((gist, index)=>{
                                let tags = [];
                                return(
                                    <li key={gist.id} className="list-item">
                                        <div className="file-list">
                                            <h3>Files</h3>
                                            {
                                                Object.keys(gist.files).map((file, i)=>{
                                                    if (gist.files[file].language && tags.indexOf(gist.files[file].language) === -1) {
                                                        tags.push(gist.files[file].language);
                                                    }
                                                    return (
                                                        <div key={i} className="file-details">
                                                            <span>{gist.files[file].filename}</span><span>{gist.files[file].language}</span><span>{gist.files[file].type}</span>
                                                        </div>
                                                    );
                                                })
                                            }
                                            <div className="gist-tag">
                                                {
                                                    tags.map((tag, i) => {
                                                        return(
                                                            <a href="javascript:void(0);" key={i}>{tag}</a>
                                                        );
                                                    })
                                                }
                                            </div>

                                        </div>
                                        <ForkList id={gist.id} />
                                    </li>
                                )
                            })
                        }
                    </ul>
                    {this.state.noResult && <h4>{'No Results found for ' +this.state.value}</h4>}
                </div>
            </div>
        );
    }
}

class ForkList extends Component {
    constructor(props) {
        super(props);
        this.getForkUser = this.getForkUser.bind(this);
        this.state = {forks: [], loading: false}
    }

    getForkUser() {
        let self = this;
        self.setState({
            loading: true
        })
        ApiRequest({
            url: 'gists/'+this.props.id+'/forks'
        }).then((forks)=>{
            if (forks.length) {
                self.setState({
                    forks,
                    loading: false
                });
            } else {
                self.setState({
                    noFork: true,
                    loading: false
                })
            }
            
        }).catch((err) => alert(err));
    }
    render() {
        return (
           <div className="fork-view">
               <a className="fork-btn" href="javascript:void(0);" onClick={this.getForkUser}>Click here to get fork's user list</a>
               <ul className="fork-list">
                   {
                        this.state.forks.length !==0 && this.state.forks.slice(0,3).map((user, index)=>{
                            return (
                                <li key={user.id}>
                                    <a href={user.owner.html_url} target="_blank">
                                        <img src={user.owner.avatar_url} alt="avatar"/>
                                        <span>{user.owner.login}</span>
                                    </a>
                                </li>
                            );
                        })
                   }
               </ul>
               {
                    this.state.noFork && <div>
                            <span>No user has forked it</span>
                            </div>
               }
               {this.state.loading && <Loader />}
               
           </div>
        );
    }
}

export default App;
