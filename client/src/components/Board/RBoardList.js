import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class RBoardList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            responseSwtoolList: [],
            currentPage: 1,
            totalPage: 1,
            itemsPerPage: 10,
        };
    }

    componentDidMount() {
        this.callSwToolListApi();
    }

    callSwToolListApi = async (page = 1) => {
        try {
            const response = await axios.get(`/api/list?btype=R&page=${page}&perPageNum=10`);
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

        // 최신 데이터 순서로 정렬
        const sortedList = responseSwtoolList.slice().sort((a, b) => new Date(b.regdate) - new Date(a.regdate));

        // 현재 페이지에 해당하는 데이터만 추출
        const startIndex = (this.state.currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentPageData = sortedList.slice(startIndex, endIndex).reverse(); // 역순으로 정렬

        const totalItemCount = sortedList.length;

        return currentPageData.map((data, index) => (
            <tr key={data.bid}>
                <td>{totalItemCount - (startIndex + index)}</td>
                <td>
                    <Link to={`RContentView/${data.bid}`}>{data.title}</Link>
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

    render() {
        const { currentPage, totalPage } = this.state;
        const pageNumbers = Array.from({ length: totalPage }, (_, i) => i + 1);

        return (
            <section className="sub_wrap">
                <article className="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                    <div className="li_top">
                        <h2 className="s_tit1">공지사항</h2>
                        <div className="li_top_sch af">
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
                            <Link to="/RBoardView/" className="sch_bt2 wi_au">
                                글쓰기
                            </Link>
                        </div>
                    </div>

                    <div className="list_cont list_cont_admin">
                        <table className="table_ty1 ad_tlist">
                            <thead>
                                <tr>
                                    <th>글번호</th>
                                    <th>제목</th>
                                    <th>작성자</th>
                                    <th>조회수</th>
                                    <th>작성일</th>
                                </tr>
                            </thead>
                        </table>

                        <table className="table_ty2 ad_tlist">
                            <tbody>{this.renderTableRows()}</tbody>
                        </table>

                        <div className="pagination">
                            <button className="pagination_bt1" onClick={() => this.handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                이전
                            </button>
                            {pageNumbers.map((number) => (
                                <button id="pagination_bt2"
                                    key={number}
                                    onClick={() => this.handlePageChange(number)}
                                    className={currentPage === number ? 'active' : ''}
                                >
                                    {number}
                                </button>
                            ))}
                            <button className="pagination_bt1" onClick={() => this.handlePageChange(currentPage + 1)} disabled={currentPage === totalPage}>
                                다음
                            </button>
                        </div>
                    </div>
                </article>
            </section>
        );
    }
}

export default RBoardList;