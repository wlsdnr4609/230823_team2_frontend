import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import cookie from 'react-cookies';
import $ from 'jquery';

class QBoardList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            responseSwtoolList: '',
            append_SwtoolList: '',
            selected: null,
            niname: '',
        }
    }
    componentDidMount() {
        var cookie_usernm = cookie.load('niname')
        this.setState({ niname: cookie_usernm })

        this.callSwToolListApi()
    }

    callSwToolListApi = async () => {
        axios.post('/api/qlist', {
            btype: "Q",
            niname: this.state.niname
        })
            .then(response => {
                try {
                    this.setState({ responseSwtoolList: response });
                    this.setState({ append_SwtoolList: this.SwToolListAppend() });
                } catch (error) {
                    alert('작업중 오류가 발생하였습니다.');
                }
            })
            .catch(error => { alert('작업중 오류가 발생하였습니다.'); return false; });
    }

    




    formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear().toString().slice(2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);

        return `${year}/${month}/${day} ${hours}:${minutes}`;
    };

    SwToolListAppend = () => {
        let result = []
        var SwToolList = this.state.responseSwtoolList.data

        for (let i = 0; i < SwToolList.length; i++) {
            var data = SwToolList[i]

            result.push(
                <tr key={data.bid}>
                    <td>{data.bid}</td>
                    <td>
                        <Link to={'ContentView/' + data.bid}>{data.title}</Link></td>
                    <td>{data.niname}</td>
                    <td>{data.counts}</td>
                    <td>{this.formatDate(data.regdate)}</td>
                </tr>
            )
        }
        return result;
    }






    render() {
        return (
            <section class="sub_wrap" >
                <article class="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                    <div class="li_top">
                        <h2 class="s_tit1">공지사항</h2>
                        <div class="li_top_sch af">
                            <td class="fileBox fileBox_w1">
                                <select id="fileSh" name="email2" className="btn_file">
                                    <option value=""> 선택 </option>
                                    <option value='title'>제목</option>
                                    <option value='niname'>작성자</option>
                                </select>
                                <input type="text" id="manualfile" class="fileName fileName1" />
                                <a href="javascript:" className="btn_file"
                                    onClick={(e) => this.handleFileInput('file', e)}>검색</a>
                                {/* <label for="uploadBtn1" class="btn_file">검색</label>
                                <input type="file" id="imageSelect" className="uploadBtn uploadBtn1"
                                                onChange={e => this.handleFileInput('file',e)}/> */}

                            </td>
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

export default QBoardList;