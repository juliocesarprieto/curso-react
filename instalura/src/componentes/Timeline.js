import React, { Component } from 'react';
import FotoItem from './Foto';
import Pubsub from 'pubsub-js';

export default class Timeline extends Component {

    constructor(){
        super();
        this.state = {fotos:[]};
    }

    carregarFotos(props){
        let urlPerfil;

        if(props.login === undefined){
            urlPerfil = `http://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        }
        else{
            urlPerfil = `http://instalura-api.herokuapp.com/api/public/fotos/${props.login}`;
        }

        fetch(urlPerfil)
        .then(response => response.json())
        .then(fotos => {
            this.setState({fotos});
        });
    }

    componentDidMount(){     
        this.carregarFotos(this.props);
    }

    componentWillMount(){
        Pubsub.subscribe('timeline', (topico, fotos)=>{
            this.setState({fotos: fotos.fotos});            
        });
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.login !== undefined){            
            this.carregarFotos(nextProps);
        }
    }

    render(){
        return (
        <div className="fotos container">
          {
            this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto}/>)
          }          
        </div>            
        );
    }
}