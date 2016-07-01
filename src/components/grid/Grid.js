import React, {Component, PropTypes} from 'react';
import "./Grid.less";

class Grid extends Component {

    static propTypes = {
        items: PropTypes.array.isRequired,
        onClickCell: PropTypes.func.isRequired
    };
    
    onClickCellHandler(i, j){
        return (e) => {
            this.props.onClickCell(i, j);
        }
    }

    render() {
        return (
            <div className="Grid">
                {this.props.items.map((row,i) => (
                    <div className="Grid__row" key={`row-${i}`}>
                        {row.map((cell,j) => (
                            <div className="Grid__cell" key={`cell-${j}`} onClick={this.onClickCellHandler(i, j)}>
                                <span className="Circle" style={{opacity: cell}}/>
                            </div>    
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}

export default Grid;