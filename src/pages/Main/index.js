import React, { Component } from 'react';
import moment from 'moment';

import api from '../../services/api';

import CompareList from '../../components/CompareList';

import { Container, Form } from './styles';
import logo from '../../assets/logo.png';

export default class Main extends Component {
  state = {
    localStorageAvailable: true,
    repositoryLoading: false,
    repositoryError: false,
    repositoryInput: '',
    repositories: [],
  };

  componentDidMount() {
    if (typeof Storage !== typeof undefined) {
      const repositories = JSON.parse(localStorage.getItem('@gitcompare:repos'));
      if (repositories !== null) {
        this.setState({ repositories });
      }
    } else {
      this.setState({ localStorageAvailable: false });
    }
  }

  /**
   * Add new repository to state and local storage (if available);
   */
  handleAddRepository = async (e) => {
    e.preventDefault();

    const { localStorageAvailable, repositoryInput, repositories } = this.state;

    try {
      this.setState({ repositoryLoading: true });

      const { data: repository } = await api.get(`repos/${repositoryInput}`);

      repository.lastCommit = moment(repository.pushed_at).fromNow();
      this.setState({
        repositoryError: false,
        repositoryInput: '',
        repositories: [...repositories, repository],
      });

      if (localStorageAvailable) {
        localStorage.setItem('@gitcompare:repos', JSON.stringify([...repositories, repository]));
      }
    } catch (err) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({
        repositoryLoading: false,
      });
    }
  };

  /**
   * Remove repository.
   */
  handleRemoveRepository = (repository) => {
    const { repositories, localStorageAvailable } = this.state;
    const filteredRepos = repositories.filter(item => item.full_name !== repository);

    this.setState({ repositories: filteredRepos });
    if (localStorageAvailable) {
      localStorage.setItem('@gitcompare:repos', JSON.stringify(filteredRepos));
    }
  };

  /**
   * Update repository.
   */
  handleUpdateRepository = async (repository) => {
    const { localStorageAvailable, repositories } = this.state;

    try {
      this.setState({
        repositoryLoading: true,
      });

      const { data } = await api.get(`repos/${repository}`);
      data.lastCommit = moment(repository.pushed_at).fromNow();

      const filteredRepos = repositories.map((item) => {
        if (item.full_name === repository) {
          return data;
        }

        return item;
      });
      this.setState({
        repositoryError: false,
        repositoryInput: '',
        repositories: filteredRepos,
      });

      if (localStorageAvailable) {
        localStorage.setItem('@gitcompare:repos', JSON.stringify(filteredRepos));
      }
    } catch (err) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ repositoryLoading: false });
    }
  };

  render() {
    const { state } = this;
    return (
      <Container>
        <img src={logo} alt="Github Compare" />
        <Form error={state.repositoryError} onSubmit={this.handleAddRepository}>
          <input
            type="text"
            placeholder="user/repository"
            value={state.repositoryInput}
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />

          <button type="submit">
            {state.repositoryLoading ? <i className="fa fa-spinner fa-pulse" /> : 'Load'}
          </button>
        </Form>

        <CompareList
          repositories={state.repositories}
          handleRemove={this.handleRemoveRepository}
          handleUpdate={this.handleUpdateRepository}
          updating={state.repositoryUpdating}
          updatingError={state.repositoryUpdatingError}
        />
      </Container>
    );
  }
}
