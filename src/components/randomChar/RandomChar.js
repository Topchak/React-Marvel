import { Component } from 'react';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import MarvelServices from '../../services/MarvelService';
import Spinner from '../widgets/spiner/Spiner';
import ErrorMessage from '../ErrorMessage/ErrorMessage'

class RandomChar extends Component {

    state = {
        char : {},
        loading: true,
        error: false
    }


    marvelService = new MarvelServices();

    componentDidMount(){
        this.updateChar();
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    onCharLoaded = (char) =>{
        this.setState({char, loading: false});
    }

    onCharLoading = () =>{
        this.setState({
            loading: true
        })
    }

    onError = () =>{
        this.setState({
            error: true,
            loading: false
        })

    }

    updateChar = () =>{
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.onCharLoading();
        this.marvelService
        .getCharacter(id)
        .then(this.onCharLoaded)
        .catch(this.onError)
    }
  

    render () {
        const {char, loading, error} = this.state;
        const errorMassage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <Viev char={char}/> : null;

        return (
        <div className="randomchar">
            
            {errorMassage}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main" onClick={this.updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
        )
    }
}

const Viev = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    
    const thumbnailStyle = {
        objectFit: thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? 'contain' : 'cover'
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={thumbnailStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
    </div>
    )
}

export default RandomChar;