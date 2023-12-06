import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";

class NBoardList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            responseSwtoolList: '',
            append_SwtoolList: '',
        }
    }
    componentDidMount() {
        this.callSwToolListApi()
    }

    callSwToolListApi = async () => {
        axios.get('http://192.168.0.83:8080/api/list?btype=F', {
        })
        .then( response => {
            try {
                this.setState({ responseSwtoolList: response });
                this.setState({ append_SwtoolList: this.SwToolListAppend() });
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    SwToolListAppend = () => {
        let result = []
        var SwToolList = this.state.responseSwtoolList.data
        
        for(let i=0; i<SwToolList.length; i++){
            var data = SwToolList[i]

            result.push(
                <tr>
                    <td>{data.bid}</td>
                    <td>
                        <Link to={'ContentView/'+data.bid }>{data.title}</Link></td>
                    <td>{data.niname}</td>                    
                    <td>{data.counts}</td>
                    <td>{data.regdateate}</td>
                </tr>
            )
        }
        return result
    }   

    render () {
        return (
            <section class="sub_wrap" >
                <article class="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                    <div class="li_top">
                        <h2 class="s_tit1">공지사항</h2>
                        <div class="li_top_sch af">
                        <Link to={'/NBoardView/'} className="sch_bt2 wi_au"> 글쓰기</Link>
                        </div>
                    </div>

                    <div class="list_cont list_cont_admin">
                        <table class="table_ty1 ad_tlist">
                            <tr>
                                <th>글번호</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>조회수</th>
                                <th>작성일</th>
                                
                            </tr>
                        </table>	
                        <table class="table_ty2 ad_tlist">
                            {this.state.append_SwtoolList}
                        </table>
                    </div>
                </article>
            </section>
        );
    }
}

export default NBoardList;