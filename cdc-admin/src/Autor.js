import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './components/inputCutomizado';

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
            console.log("ENVIADO COM SUCESSO");
          },
          error: function(response){
            console.log("ERROR");
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
      }  

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
                  this.state.lista.map(function(autor){
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