import { Component, Fragment } from 'react';
import MarvelServices from '../../services/MarvelService';
import PropTypes from 'prop-types';
import './charInfo.scss';
import Spinner from '../widgets/spiner/Spiner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton'

class CharInfo extends Component {

 
    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelServices();


    componentDidMount(){
        this.updateChar();
    }
    componentDidUpdate(prevProps){
        if(this.props.charId !== prevProps.charId){
            this.updateChar();
        }
    }




    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }
        
        this.onCharLoading();
        this.marvelService
        .getCharacter(charId)
        .then(this.onCharLoaded)
        .catch(this.onError)
    }


    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        })
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    
    
    render(){
        const { char, loading, error } = this.state;

        const skeleton =  char || loading || error ? null : <Skeleton/>
        const errorMassage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <this.View char={char}/> : null;
        return (
            <div className="char__info">
                {skeleton}
                {errorMassage}
                {spinner}
                {content}
            </div>
        )
    }
    
    
    View = ( {char}) => {
        const {name, description, thumbnail, homepage, wiki , comics} = char;

        let imgStyle = {'objectFit' : 'cover'};
        if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgStyle = {'objectFit' : 'contain'};
        }
        return (
            <Fragment>
                <div className="char__basics">
                    <img src={thumbnail} alt={name} style={imgStyle}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {comics.length > 0 ? null : 'There is no comics with this character'}
                    {
                        comics.map((item, i) => {
                            return (
                                <li className="char__comics-item" key={i}>
                                    <a href={item.resourceURI}>
                                        {item.name}
                                    </a>
                                  
                                </li>
                            )
                        })
                    }
                </ul>
            </Fragment>
        )
    }
    
    


}


CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;