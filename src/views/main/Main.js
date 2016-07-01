import React, {Component,PropTypes} from 'react';
import {connect} from 'react-redux';
import "./Main.less";
import {Grid} from 'components';
import {gridActions} from 'store/actions';

class Main extends Component {

    componentWillMount(){
        this.props.dispatch(gridActions.init());
        this.animateId = this.animate();
    }

    componentWillUnmount(){
        clearInterval(this.animateId);
    }

    animate(){
        return setInterval(()=>{
            let have_changes = false;
            let items = this.props.grid.items.map(row => {
                return row.map(cell => {
                    if (cell != 0){
                        have_changes = true;
                        cell*= 0.25;
                        return cell > 0.02 ? cell : 0;
                    }else{
                        return 0;
                    }
                })
            });
            if (have_changes){
                this.props.dispatch(gridActions.update(items));
            }
        }, 3000);
    };
    
    onClickCell = (i, j) => {
        if (!this.props.grid.items[i][j]){
            let items = [...this.props.grid.items];
            items[i][j] = 1;
            this.props.dispatch(gridActions.update(items));
        }
    };

    render() {
        
        const {grid:{loading, updating, items}} = this.props;
        
        return (   
            <div className="Main">
                <div className="Main__status">
                    {loading ? <div>Загрузка...</div> : null}
                    {updating ? <div>Сохранение...</div> : null}
                </div>                
                <Grid
                    items={items}
                    onClickCell={this.onClickCell}
                    />
                
            </div>    
        );
    }
}

export default connect(state => ({
    grid: state.grid
}))(Main);