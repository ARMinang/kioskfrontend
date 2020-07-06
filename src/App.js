import React, { Component } from 'react'
import { Button, Dimmer, Form, Grid, Header,  Loader, Segment, Table } from 'semantic-ui-react'
import axios from 'axios'
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

export default class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      kpjError: false,
      saldo: 0,
      namaLengkap: '',
      statusAktif: '',
      loading: false,
      input: ""
    }
  }

  handleSubmit= (e) => {
    e.preventDefault()
    const {input} = this.state
    this.setState({loading: !this.state.loading})
    axios.post('http://UBUNTUSRV:9000/getSaldo', {input} )
      .then((result) => {
        const {saldo, namaLengkap, statusAktif} = result.data
        this.setState({saldo, namaLengkap, statusAktif})
        this.setState({loading: !this.state.loading})
        setTimeout(() => {
          this.setState({saldo: 0, input: ''}, () => {
            console.log("inputState", this.state.input)
            this.keyboard.setInput(this.state.input)
          })
        }, 10000)
      })
      .catch((err) => {
        this.setState({kpjError: {
          content:"No. KPJ tidak ditemukan",
          pointing: 'below'}, loading: !this.state.loading})
        setTimeout(() => {
          this.setState(
            {saldo: 0, input: '', kpjError: false},
            () => {
              console.log("input", this.state.input)
            }
          )
        }, 10000)
      })
  }

  onChange = input => {
    this.setState({
      input: input
    });
    console.log("Input changed", input);
  };

  onChangeInput = event => {
    let input = event.target.value;
    this.setState(
      {
        input: input
      },
      () => {
        this.keyboard.setInput(input);
      }
    )
  }


  render() {
    return(
      <Segment>
        <Dimmer active={this.state.loading} page={true}>
          <Loader />
        </Dimmer>
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Row>
            <Grid.Column style={{ maxWidth: 900 }}>
              <Header as='h2' color='teal' textAlign='center'>
                Cek Saldo KPJ
              </Header>
              <Form size='large' onSubmit={this.handleSubmit} autoComplete="off">
                <Segment stacked>
                  <Form.Input
                    error={this.state.kpjError}
                    id='kpj'
                    fluid
                    icon='user'
                    iconPosition='left'
                    placeholder='No. KPJ'
                    required={true}
                    onFocus={this.handleFocus}
                    value={this.state.input}
                    onChange={e => this.onChangeInput(e)}/>
                  <Button color='teal' fluid size='large' type='submit'>
                    Cek
                  </Button>
                </Segment>
              </Form>
              {
                this.state.saldo === 0 
                  ? '' 
                  : (
                    <Table striped>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell>Nama</Table.Cell>
                          <Table.Cell>{this.state.namaLengkap}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Status Aktif</Table.Cell>
                          <Table.Cell>{this.state.statusAktif}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Saldo</Table.Cell>
                          <Table.Cell>Rp. {this.state.saldo.toLocaleString('id-ID')}</Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  )
                }
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ maxWidth: 900, maxHeight: 200 }}>    
            <Keyboard
              keyboardRef={r => (this.keyboard = r)}
              layout={{
                default: [
                  "1 2 3 4 5 6 7 8 9 0 {bksp}",
                  "Q W E R T Y U I O P",
                  "A S D F G H J K L",
                  "Z X C V B N M",
                ]
              }}
              onChange={input => this.onChange(input)}
              onKeyPress={this.keyOnKeyPress}
                />
          </Grid.Row>
          <Grid.Row></Grid.Row>
        </Grid>
      </Segment>
    )
  }
}
