import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class NBoardList extends Component {
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

    callSwToolListApi = async (page = 1, searchCriteria = null) => {
        try {
            let url = `/api/list?btype=N&page=${page}&perPageNum=10`;

            if (searchCriteria) {
                // searchCriteria에 따라서 적절한 검색 조건을 URL에 추가
                if (searchCriteria.niname) {
                    url += `&cri=niname=${searchCriteria.niname}`;
                }
                // 다른 검색 조건에 대한 추가 로직을 여기에 작성
            }

            const response = await axios.get(url);
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


        // rnum 값 확인

        return currentPageData.map((data) => (
            <tr key={data.rnum}>
                <td>{data.rnum}</td>
                <td>
                    <Link to={`ContentView/${data.bid}`}>{data.title}</Link>
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
                            <Link to="/NBoardView/" className="sch_bt2 wi_au">
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
    handleSearchChange = (e) => {
        // 검색어가 변경될 때마다 호출되어 검색어 상태 업데이트
        this.setState({ searchKeyword: e.target.value });
    };

    handleSearchSubmit = () => {
        // 검색어를 기반으로 검색 요청
        const { searchKeyword } = this.state;
        const searchCriteria = { niname: searchKeyword }; // 검색 조건 객체 생성
        this.callSwToolListApi(1, searchCriteria); // 첫 페이지부터 검색 수행
    };
}


export default NBoardList;