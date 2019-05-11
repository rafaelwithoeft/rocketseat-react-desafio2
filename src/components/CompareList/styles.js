import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 50px;
`;

export const Repository = styled.div`
  width: 250px;
  background: #fff;
  border-radius: 3px;

  display: flex;
  flex-direction: column;
  margin: 0 10px;

  header {
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      width: 64px;
    }

    strong {
      font-size: 24px;
      margin-top: 10px;
    }

    small {
      font-size: 14px;
      color: #666;
    }
  }

  ul {
    list-style: none;

    li {
      font-weight: bold;
      padding: 12px 20px;

      small {
        font-weight: normal;
        font-size: 12px;
        color: #999;
        font-style: italic;
      }

      &:nth-child(2n -1) {
        background: #f5f5f5;
      }
    }
  }

  footer {
    display: flex;
    justify-content: stretch;
    flex-direction: column;

    button {
      padding: 5px;
      border: 0;
      font-size: 14px;
      font-weight: bold;
    }

    button.danger {
      background-color: #e53935;
      color: #fff;
      &:hover {
        background-color: #c62828;
      }
    }

    button.info {
      background: #bbdefb;
      color: #0d47a1;
      &:hover {
        background-color: #90caf9;
      }
    }
  }
`;
