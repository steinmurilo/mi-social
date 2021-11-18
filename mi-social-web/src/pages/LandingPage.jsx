import React, { useEffect, useState } from 'react';
import { Trash2, ArrowRight, ArrowLeft } from 'react-feather'
import api from '../services/api';
import { ufList } from '../utils/enums';

const LandingPage = () => {
    const [data, setData] = useState([]);
    const [offset, setOffset] = useState(0);
    const [uf, setUf] = useState('');
    const [update, setUpdate] = useState(false);
    const [valueSort, setValueSort] = useState('');
    const [order, setOrder] = useState('');

    useEffect(() => {
        //sempre que alguma das constantes for atualizada, recarrega a tabela
        api.get(`docs?_limit=15&_page=${offset}${uf !== '' ? '&siglauf=' + uf : ''}${valueSort !== '' ? '&_sort=' + valueSort + '&_order=' + order : ''}`).then(res => {
            setData(res.data);
            setUpdate(false);
        })
    }, [offset, uf, update, valueSort, order]);


    function renderOption() {
        //carrega a lista de UF de maneira mais dinâmica consultando o arquivo enums.js
        return ufList.map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
        ))
    }

    function renderComponents() {
        //de acordo com o retorno, renderiza as linhas da tabela
        return data.map((register, index) => (
            <tr key={index}>
                <td>{register.anomes}</td>
                <td>{register.ibge}</td>
                <td>{register.qtd_ben_bas}</td>
                <td>{register.qtd_ben_bsp}</td>
                <td>{register.qtd_ben_bvg}</td>
                <td>{register.qtd_ben_bvj}</td>
                <td>{register.qtd_ben_bvn}</td>
                <td>{register.qtd_ben_var}</td>
                <td>{register.siglauf}</td>
                <td> <Trash2 onClick={() => handleDelete(register.id)} /> </td>
            </tr>
        ));
    }

    function handleInsertRegister(e) {
        //realiza a inserção do novo registro e recarrega a tabela
        e.preventDefault();

        if (window.confirm('adicionar novo registro ?')) {
            let target = e.target
            const formData = {
                "anomes": `${target.anomes.value}`,
                "ibge": `${target.ibge.value}`,
                "qtd_ben_bas": `${target.qtd_ben_bas.value}`,
                "qtd_ben_bsp": `${target.qtd_ben_bsp.value}`,
                "qtd_ben_bvg": `${target.qtd_ben_bvg.value}`,
                "qtd_ben_bvj": `${target.qtd_ben_bvj.value}`,
                "qtd_ben_bvn": `${target.qtd_ben_bvn.value}`,
                "qtd_ben_var": `${target.qtd_ben_var.value}`,
                "siglauf": `${target.siglauf.value}`,
            }
            api.post(`docs`, formData).then(res => {
                alert("adicionado com sucesso!");
                setUpdate(true);
            })
        }
    }

    function handleDelete(id) {
        //deleta o registro selecionado e recarrega a tabela
        if (window.confirm('deletar esse registro ?')) {
            api.delete(`docs/${id}`).then(res => {
                alert("deletado com sucesso!");
                setUpdate(true);
            })
        }
    }

    function handleChangeUF(e) {
        //atualiza a constante UF para recarregar a tabela de acordo com a UF pesquisada
        setUf(e.target.value);
    }

    function handleSort(value) {
        //muda a ordenação da tabela de acordo com o campo selecionado do cabeçalho
        if (valueSort === value) {
            if (order === 'asc') {
                setOrder('desc');
            } else {
                setOrder('asc');
            }
        } else {
            setValueSort(value);
            setOrder('asc');
        }
    }

    function handleChangeOffset(validate) {
        //realiza a paginação da tabela
        let newOffset = offset;
        if (validate) {
            newOffset = newOffset + 15;
        } else {
            if (newOffset > 0)
                newOffset = newOffset - 15;
        }
        setOffset(newOffset);
    }


    return (
        <div className='container'>
            <div className='data-form'>
                <span>Adicionar Registro</span>
                <form onSubmit={(e) => handleInsertRegister(e)}>
                    <div className='form-row'>
                        <div>
                            <label htmlFor="anomes">Ano/Mês:</label>
                            <input type="text" id="anomes" name="anomes" />
                        </div>
                        <div>
                            <label htmlFor="ibge">IBGE:</label>
                            <input type="text" id="ibge" name="ibge" />
                        </div>
                        <div>
                            <label htmlFor="qtd_ben_bas">Qtd Benefícios Básicos:</label>
                            <input type="text" id="qtd_ben_bas" name="qtd_ben_bas" />
                        </div>
                        <div>
                            <label htmlFor="qtd_ben_bsp">Qtd Benefícios Superação extrema pobreza:</label>
                            <input type="text" id="qtd_ben_bsp" name="qtd_ben_bsp" />
                        </div>
                        <div>
                            <label htmlFor="qtd_ben_bvg">Qtd Benefícios Gestantes:</label>
                            <input type="text" id="qtd_ben_bvg" name="qtd_ben_bvg" />
                        </div>
                    </div>
                    <div className='form-row'>
                        <div>
                            <label htmlFor="qtd_ben_bvj">Qtd Benefícios Jovem:</label>
                            <input type="text" id="qtd_ben_bvj" name="qtd_ben_bvj" />
                        </div>
                        <div>
                            <label htmlFor="qtd_ben_bvn">Qtd Benefícios Nutriz:</label>
                            <input type="text" id="qtd_ben_bvn" name="qtd_ben_bvn" />
                        </div>
                        <div>
                            <label htmlFor="qtd_ben_var">Qtd Benefícios Variáveis:</label>
                            <input type="text" id="qtd_ben_var" name="qtd_ben_var" />
                        </div>
                        <div>
                            <label htmlFor="siglauf">UF :</label>
                            <select name="siglauf" id="siglauf">
                                {renderOption()}
                            </select>
                        </div>
                        <div>
                            <button type="submit">Send</button>
                        </div>
                    </div>
                </form>
            </div>
            <div className='data-select'>
                <select name="select-uf" id="select-uf" onChange={(e) => handleChangeUF(e)}>
                    <option value="">Select...</option>
                    {renderOption()}
                </select>
            </div>
            <div className='data-table'>
                <table style={{ textAlign: 'center' }}>
                    <thead>
                        <tr>
                            <th className={valueSort === 'anomes' ? 'selected' : ''} onClick={() => handleSort('anomes')}>Ano/Mês</th>
                            <th className={valueSort === 'ibge' ? 'selected' : ''} onClick={() => handleSort('ibge')}>Cod IBGE</th>
                            <th className={valueSort === 'qtd_ben_bas' ? 'selected' : ''} onClick={() => handleSort('qtd_ben_bas')}>Qtd Benefícios Básicos</th>
                            <th className={valueSort === 'qtd_ben_bsp' ? 'selected' : ''} onClick={() => handleSort('qtd_ben_bsp')}>Qtd Benefícios Superação extrema pobreza</th>
                            <th className={valueSort === 'qtd_ben_bvg' ? 'selected' : ''} onClick={() => handleSort('qtd_ben_bvg')}>Qtd Benefícios Gestantes</th>
                            <th className={valueSort === 'qtd_ben_bvj' ? 'selected' : ''} onClick={() => handleSort('qtd_ben_bvj')}>Qtd Benefícios Jovem</th>
                            <th className={valueSort === 'qtd_ben_bvn' ? 'selected' : ''} onClick={() => handleSort('qtd_ben_bvn')}>Qtd Benefícios Nutriz</th>
                            <th className={valueSort === 'qtd_ben_var' ? 'selected' : ''} onClick={() => handleSort('qtd_ben_var')}>Qtd Benefícios Variáveis</th>
                            <th className={valueSort === 'siglauf' ? 'selected' : ''} onClick={() => handleSort('siglauf')}>UF</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderComponents()}
                    </tbody>
                    <tfoot>
                    </tfoot>
                </table>
            </div>
            <div className='button-container'>
                <button onClick={() => handleChangeOffset(false)}><ArrowLeft /></button>
                <button onClick={() => handleChangeOffset(true)}><ArrowRight /></button>
            </div>


        </div>
    )

}

export default LandingPage