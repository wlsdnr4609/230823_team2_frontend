import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';

class NBoardList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            responseSwtoolList: '',
            append_SwtoolList: '',
            responseQList: '',
            append_QList: '',
            selected: null,
        }
    }
    componentDidMount() {
        this.callSwToolListApi()
    }

    callSwToolListApi = async () => {
        axios.get('/api/list?btype=N', {
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

    SwToolListAppend = () => {
        let result = []
        var SwToolList = this.state.responseSwtoolList.data

        for (let i = 0; i < SwToolList.length; i++) {
            var data = SwToolList[i]

            result.push(
                <tr>
                    <td>{data.bid}</td>
                    <td>
                        <Link to={'ContentView/' + data.bid}>{data.title}</Link></td>
                    <td>{data.niname}</td>
                    <td>{data.counts}</td>
                    <td>{data.regdate}</td>
                </tr>
            )
        }
        return result
    }

//api주소 확인해서 변경
    submitClick = async (type, e) => {
        this.fileSc = $('#manualfile').val();

        axios.post('/api/qlist', {
            email: this.fileSc
        })
        .then(response => {
            try {
                this.setState({ responseQList: response });
                this.setState({ append_QList: this.QListAppend() });
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch(error => { alert('작업중 오류가 발생하였습니다.'); return false; });

    }



    handleFileInput(type, e){
        if(type ==='file'){
            $('#imagefile').val(e.target.files[0].name)
        }else if(type ==='file2'){
            $('#imagefile2').val(e.target.files[0].name)
        }else if(type ==='manual'){
            $('#manualfile').val(e.target.files[0].name)
        }
        this.setState({
          selected : e.target.files[0],
        })
        setTimeout(function() {
            if(type ==='manual'){
                this.handlePostMenual()
            }else{
                this.handlePostImage(type)
            }
        }.bind(this),1
        );
    }




    render() {
        return (
            <section class="sub_wrap" >
                <article class="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                    <div class="li_top">
                        <h2 class="s_tit1">공지사항</h2>
                        <div class="li_top_sch af">
                            <td class="fileBox fileBox_w1">
                                <select id="manualfile" name="email2" className="btn_file">
                                    <option value=""> 선택 </option>
                                    <option value='title'>제목</option>
                                    <option value='niname'>작성자</option>
                                </select>
                                <input type="text" id="manualfile" class="fileName fileName1" />
                                <label for="uploadBtn1" class="btn_file">검색</label>
                                <input type="file" id="imageSelect" className="uploadBtn uploadBtn1"
                                                onChange={e => this.handleFileInput('file',e)}/>
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

export default NBoardList;