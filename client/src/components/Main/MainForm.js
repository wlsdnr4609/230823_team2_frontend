import React, { Component } from 'react';
// import {Link} from 'react-router-dom';
// import axios from "axios";
// import Swal from 'sweetalert2'

class MainForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }
    componentDidMount() {
    }       
    render () {
        return (
            <section class="sub_wrap" >
                <article class="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                <img src={require("../../img/main/충전소001.png")} height="650px" width="1500px"></img>
                </article>
            </section>
        );
    }
}

export default MainForm;