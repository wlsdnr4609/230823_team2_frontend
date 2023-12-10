import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import cookie from 'react-cookies';

class QBoardList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            responseSwtoolList: [],
            currentPage: 1,
            totalPage: 1,
            itemsPerPage: 10,
            niname2: '', //로그인한 닉네임
        };
    }
    componentDidMount() {
        var cookie_usernm = cookie.load('niname')
        this.setState({ niname2: cookie_usernm })  //niname2=로그인한 사람
        this.callSwToolListApi()
    }

    callSwToolListApi = async (page = 1) => {
        try {
            const response = await axios.post(`/api/list?btype=Q&page=${page}&perPageNum=10`, {
                niname: this.state.niname2,
            });
            const totalCount = response.headers['x-total-count'];
            this.setState({ totalPage: Math.ceil(totalCount / 10) });

            this.setState({
                responseSwtoolList: response.data,
                currentPage: page,
                totalCount: totalCount,

            });
        } catch (error) {
            alert('작업중 오류가 발생하였습니다.');
        }
    };
    handlePageChange = (pageNumber) => {
        this.callSwToolListApi(pageNumber);
    };

    renderTableRows = () => {
        const { responseSwtoolList, itemsPerPage } = this.state;

        // 현재 페이지에 해당하는 데이터만 추출
        const startIndex = (this.state.currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentPageData = responseSwtoolList.slice(startIndex, endIndex);

        return currentPageData.map((data) => (
            <tr key={data.bid}>
                <td>{data.bid}</td>
                <td>
                    <Link to={`QContentView/${data.bid}`}>{data.title}</Link>
                </td>
                <td>{data.niname}</td>
                <td>{data.counts}</td>
                <td>{this.formatDate(data.regdate)}</td>
            </tr>
        ));
    };


    formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear().toString().slice(2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);

        return `${year}/${month}/${day} ${hours}:${minutes}`;
    };
    
    //게시판 서치 api주소 확인해서 변경

    // handleFileInput(value, e){
    //     if(value ==='title'){
    //         $('#imagefile').val(title)
    //     }else if(value ==='niname'){
    //         $('#imagefile2').val(niname)
    //     }
    //     this.setState({
    //       selected : e.target.files[0],
    //     })
    // }

    render() {
        const { currentPage, totalPage } = this.state;
        const pageNumbers = Array.from({ length: totalPage }, (_, i) => i + 1);
        return (
            <section class="sub_wrap" >
                <article class="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                    <div class="li_top">
                        <h2 class="s_tit1">문의</h2>
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
                            </td>
                            <Link to={'/QBoardView/'} className="sch_bt2 wi_au"> 글쓰기</Link>
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
                        <table className="table_ty2 ad_tlist">
                            <tbody>{this.renderTableRows()}</tbody>
                        </table>
                        <form className="pagination">
                            <button className="pagination_bt1" onClick={() => this.handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                이전
                            </button>
                            {pageNumbers.map((number) => (
                                <button id="pagination_bt2"
                                    key={number}
                                    onClick={() => this.handlePageChange(number)}
                                    className={currentPage === number ? 'active' : ''}>
                                    {number}
                                </button>
                            ))}
                            <button className="pagination_bt1" onClick={() => this.handlePageChange(currentPage + 1)} disabled={currentPage === totalPage}>
                                다음
                            </button>
                        </form>
                    </div>
                </article>
            </section>
        );
    }
}

export default QBoardList;