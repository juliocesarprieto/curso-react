import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './components/inputCutomizado';
import Pubsub from 'pubsub-js';
import TratadorErros from './components/TratadorErros';

export class FormularioAutor extends Component{
    
    constructor() {
        super();
        this.state = {lista : [], nome: '', email: '', senha: '' };
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this); 
    }

    enviaForm(event){
        event.preventDefault();
        $.ajax({
          url: "http://cdc-react.herokuapp.com/api/autores",
          contentType: 'application/json',
          dataType: 'json',
          type: 'post',
          data: JSON.stringify({nome: this.state.nome, email: this.state.email, senha: this.state.senha}),
          success:function(response){
            // Disparar um aviso geral de novaListagem disponivel
            Pubsub.publish('atualiza-lista-autores', response);
            this.setState({nome:'', email:'', senha:''});
          }.bind(this),
          error: function(response){
            // recuperar quais foram os erros
            // exibir a mensagem de erro no campo
            if(response.status === 400){
              new TratadorErros().publicaErros(response.responseJSON);
            }
          },
          beforeSend: function(){
            Pubsub.publish("limpa-erros", {});
          }
        }
      );
      }
    
      setNome(event){
        this.setState({nome:event.target.value})
      }
    
      setEmail(event){
        this.setState({email:event.target.value})
      }
    
      setSenha(event){
        this.setState({senha:event.target.value})
      }

    render(){
        return (
            <div className="pure-form pure-form-aligned">
            <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm.bind(this)} method="post">
              <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} label="Nome"/>
              <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="Email"/>
              <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha"/>
              <div className="pure-control-group">                                  
                <label></label> 
                <button type="submit" className="pure-button pure-button-primary" >Gravar</button>                                    
              </div>
            </form>             

          </div>  
        );
    }
}

export class TabelaAutores extends Component{   

    render(){
        return (
            <div>            
            <table className="pure-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>email</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.props.lista.map(function(autor){
                    return (
                      <tr key={autor.id}>
                        <td>{autor.nome}</td>
                        <td>{autor.email}</td>
                    </tr> 
                    );
                  })
                }
              </tbody>
            </table> 
          </div>   
        );
    }
}

export default class AutorBox extends Component {
  
  constructor() {
    super();
    this.state = {lista : []};
  }

  componentDidMount(){
      $.ajax({
            url: "http://cdc-react.herokuapp.com/api/autores",
            dataType: 'json',
            success:function(response){
              console.log(response);
              this.setState({lista:response});
            }.bind(this)
          }
        );

        Pubsub.subscribe('atualiza-lista-autores', function(topico, novaLista){
          this.setState({lista:novaLista})
        }.bind(this));
    }

  render() {
    return (
      <div>
        <FormularioAutor/>
        <TabelaAutores lista={this.state.lista}/>
      </div>
    );
  }
}