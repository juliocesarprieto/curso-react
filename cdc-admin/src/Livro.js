import $ from 'jquery';
import InputCostumizado from './components/inputCutomizado';
import React, { Component } from 'react';
import Pubsub from 'pubsub-js';
import TratadorErros from './components/TratadorErros';

class FormularioLivro extends Component{

    constructor(props){
        super(props);
        this.state ={titulo: '', preco: '', autorId: ''};
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
        this.handleLivroSubmit = this.handleLivroSubmit.bind(this);        
    }

    setTitulo(event){
        this.setState({titulo:event.target.value});
    }

    setPreco(event){
        this.setState({preco:event.target.value});
    }

    setAutorId(event){
        this.setState({autorId:event.target.value});
    }

    handleLivroSubmit(event){
        event.preventDefault();
        var titulo = this.state.titulo.trim();
        var preco = this.state.preco.trim();
        var autorId = this.state.autorId;

        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/livros',
            contentType: 'application/json',
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify({titulo: titulo, preco: preco, autorId: autorId}),
            success: function(response){
                Pubsub.publish('atualiza-lista-livros', response);
                this.setState({titulo: '', preco: '', autorId: ''});
            }.bind(this),
            error: function(response){
                if(response.status === 400){
                    new TratadorErros().publicaErros(response.responseJSON);
                }
            },
            beforeSend: function(){
                Pubsub.publish("limpa-erros", {});
            }
        })
    }

    render(){

        var autores = this.props.autores.map(function(autor){
            return <option key={autor.id} value={autor.id}>{autor.nome}</option>;
        });
        return (
            <div className="autorForm">
                <form className="pure-form pure-form-aligned" onSubmit={this.handleLivroSubmit}> 
                    <InputCostumizado id="titulo" name="titulo" label="Titulo: " type="text" value={this.state.titulo} placeholder="Titulo do livro" onChange={this.setTitulo}/>
                    <InputCostumizado id="preco" name="preco" label="Preco: " type="decimal" value={this.state.preco} placeholder="Preco do livro" onChange={this.setPreco}/>
                    <div className="pure-controls">
                        <select value={this.state.autorId} name="autorId" onChange={this.setAutorId}>
                            <option value="">Seleciona</option>
                            {autores}
                        </select>
                    </div>
                    <div className="pure-controls-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                    </div>       
                </form>    
            </div>    
        );
    }
}

class Tabelalivros extends Component{
    render(){
        var livros = this.props.lista.map(function(livro){
            return (
                <tr key={livro.titulo}>
                  <td>{livro.titulo}</td>
                  <td>{livro.autor.nome}</td>
                  <td>{livro.preco}</td>
              </tr> 
            );
        });

        return(
            <div>            
                <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Titulo</th>
                      <th>Autor</th>
                      <th>Preco</th>
                    </tr>
                  </thead>
                  <tbody>
                    {                      
                     livros   
                    }
                  </tbody>
                </table> 
              </div> 
        );
    }
}


export default class LivroBox extends Component{

    constructor(props){
        super(props);
        this.state = {lista: [], autores: []};
    }

    componentDidMount(){
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/livros',
            dataType: 'json',
            success: function(response){
                this.setState({lista: response});
            }.bind(this)
        });

        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/autores',
            dataType: 'json',
            success: function(response){
                this.setState({autores: response});
            }.bind(this)
        });

        Pubsub.subscribe('atualiza-lista-livros', function(topico, lista){
            this.setState({lista:lista});
        }.bind(this));
    }

    render(){
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de Livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores}/>
                    <Tabelalivros lista={this.state.lista}/>
                </div>
            </div>    
        );
    }
}