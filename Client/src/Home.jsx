import React, { useState, useEffect, useMemo } from "react";
import Button from "@mui/material/Button";
import Spinner from "./Spinner";
import ErrorHandler from "./utils/ErrorHandler";
import toast from "react-hot-toast";
import axios from 'axios'


const Home = () => {
    const [inputData, setInputData] = useState({
        selectedProduct: null,
        customer_name: "",
        quantity: "",
        discount: "",
    });
    const [products, setProducts] = useState([]);
    const netAmount = useMemo(() => {
        if (inputData.discount === "" || inputData.selectedProduct == null)
            return null;
        const rate = inputData.selectedProduct?.rate;
        return (rate - rate * (inputData.discount / 100)).toFixed(2);
    }, [inputData.discount, inputData.selectedProduct]);
    const totalAmount = useMemo(() => {
        if (netAmount === null || inputData?.quantity === "") return null;
        return (netAmount * inputData.quantity).toFixed(2);
    }, [inputData?.quantity, netAmount]);
    const [addedProductList, setAddedProductList] = useState([]);
    const [allProductLoading, setAllProductLoading] = useState(false);
    const [createInvoiceLoading, setCreateInvoiceLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setAllProductLoading(true);
                const { data } = await axios.get(
                    `${import.meta.env.VITE_APP_SERVER_URL}/product/all`
                );
                setProducts(data?.response);
                setInputData((prevState) => ({
                    ...prevState,
                    selectedProduct: data?.response[0],
                }));
                setAllProductLoading(false);
            } catch (err) {
                setAllProductLoading(false);
                ErrorHandler(err);
            }
        })();
    }, []);

    const setInputDataHandler = (key, value) => {
        if (key == "product") {
            const productId = value;
            const product = products.find((p) => p._id === productId);
            setInputData((prevState) => ({
                ...prevState,
                ["selectedProduct"]: product,
            }));
        } else {
            setInputData((prevState) => ({
                ...prevState,
                [key]: value,
            }));
        }
    };

    const formSubmitHandler = (e) => {
        e.preventDefault();
        setAddedProductList((prevState) => [
            ...prevState,
            {
                customer_name: inputData.customer_name,
                selectedProduct: inputData.selectedProduct,
                quantity: inputData.quantity,
                discount: inputData.discount,
                netAmount,
                totalAmount,
            },
        ]);
        setInputData({
            selectedProduct: products[0],
            customer_name: "",
            quantity: "",
            discount: "",
        });
    };

    const tableProductChangeHandler = ({ index, productId }) => {
        const editedRow = addedProductList[index];
        if (productId === editedRow.selectedProduct._id) return; // if the product is same then return

        setAddedProductList((prevState) => {
            const newSelectedProduct = products.find(
                (p) => p._id === productId
            );
            const rate = newSelectedProduct.rate;
            const discount = editedRow.discount;
            const quantity = editedRow.quantity;
            let newAddedProductList = [...prevState];
            newAddedProductList[index] = {
                ...newAddedProductList[index],
                selectedProduct: newSelectedProduct,
                netAmount: (rate - rate * (discount / 100)).toFixed(2),
                totalAmount: (
                    (rate - rate * (discount / 100)) *
                    quantity
                ).toFixed(2),
            };
            return newAddedProductList;
        });
    };

    const tableQtyandDiscChangeHandler = ({ index, key, value }) => {
        if (value === "") value = 0;

        setAddedProductList((prevState) => {
            const newAddedProductList = [...prevState];
            const rate = prevState[index].selectedProduct?.rate;
            const discount =
                key === "discount" ? value : prevState[index].discount;
            const quantity =
                key === "quantity" ? value : prevState[index].quantity;
            newAddedProductList[index] = {
                ...newAddedProductList[index],
                [key]: value,
                netAmount: (rate - (rate * discount) / 100).toFixed(2),
                totalAmount: (
                    (rate - (rate * discount) / 100) *
                    quantity
                ).toFixed(2), // rate * quantity
            };
            return newAddedProductList;
        });
    };

    const tableRowRemoveHandler = (index) => {
        setAddedProductList((prevState) => {
            const newAddedProductList = [...prevState];
            newAddedProductList.splice(index, 1);
            return newAddedProductList;
        });
    };

    const submitHandler = async (e) => {
        try{
            e.preventDefault()
            setCreateInvoiceLoading(true)
            const { data } = await axios.post(`${import.meta.env.VITE_APP_SERVER_URL}/invoice/new`, { data : addedProductList})
            toast.success(data?.message)
            setCreateInvoiceLoading(false)
            setAddedProductList([]);
        }
        catch(err){
            setCreateInvoiceLoading(false)
            ErrorHandler(err)
        }
    };

    return (
        <>
            {allProductLoading ? (
                <Spinner />
            ) : (
                <div className="flex justify-center items-center flex-col gap-4 p-4">
                    {/* ------------------------- form -------------------------------- */}
                    <form
                        onSubmit={(e) => formSubmitHandler(e)}
                        className="bg-gray-200 py-4 px-8 rounded-lg shadow-md w-full sm:w-3/5 text-sm sm:text-base"
                    >
                        <p className=" text-lg font-semibold py-3 text-center">
                            Please fill the details
                        </p>
                        <div className="p-2 flex w-full justify-between">
                            <label
                                htmlFor="customer_name"
                                id="name"
                                className="text-base text-gray-900"
                            >
                                Customer Name
                            </label>
                            <input
                                type="string"
                                id="customer_name"
                                value={inputData.customer_name}
                                onChange={(e) => {
                                    setInputDataHandler(
                                        "customer_name",
                                        e.target.value
                                    );
                                }}
                                required
                            />
                        </div>
                        <div className="p-2 flex w-full justify-between">
                            <label htmlFor="product" id="product">
                                Product
                            </label>
                            <select
                                name="product"
                                id="product"
                                onChange={(e) => {
                                    setInputDataHandler(
                                        "product",
                                        e.target.value
                                    );
                                }}
                            >
                                {products?.map((product) => {
                                    return (
                                        <option
                                            key={product._id}
                                            value={product._id}
                                        >
                                            {product.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="p-2 flex w-full justify-between">
                            <label htmlFor="rate" id="rate">
                                Rate
                            </label>
                            <p>
                                {inputData.selectedProduct?.rate ||
                                    "Please select a product"}
                            </p>
                        </div>

                        <div className="p-2 flex w-full justify-between">
                            <label htmlFor="unit" id="unit">
                                Unit
                            </label>
                            <p>
                                {inputData.selectedProduct?.unit ||
                                    "Please select a product"}
                            </p>
                        </div>
                        <div className="p-2 flex w-full justify-between">
                            <label htmlFor="quantity" id="quantity">
                                Quantity
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                value={inputData.quantity}
                                onChange={(e) => {
                                    setInputDataHandler(
                                        "quantity",
                                        e.target.value
                                    );
                                }}
                                required
                            />
                        </div>
                        <div className="p-2 flex w-full justify-between">
                            <label htmlFor="discount" id="discount">
                                Discount Percentage
                            </label>
                            <input
                                type="number"
                                id="discount"
                                value={inputData.discount}
                                onChange={(e) => {
                                    setInputDataHandler(
                                        "discount",
                                        e.target.value
                                    );
                                }}
                                required
                            />
                        </div>
                        <div className="p-2 flex w-full justify-between">
                            <label htmlFor="netAmount" id="netAmount">
                                NetAmount
                            </label>
                            <p>
                                {netAmount != null
                                    ? netAmount
                                    : "Please enter quantity, discount"}
                            </p>
                        </div>
                        <div className="p-2 flex w-full justify-between">
                            <label htmlFor="totalAmount" id="totalAmount">
                                Total Amount
                            </label>
                            <p>
                                {totalAmount != null
                                    ? totalAmount
                                    : "Please enter quantity, discount"}
                            </p>
                        </div>

                        <Button variant="contained" type="submit">
                            Add +
                        </Button>
                    </form>

                    {/* -------------------------- Table ----------------------------- */}
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-900 bg-indigo-200 whitespace-nowrap">
                            <thead>
                                <tr className="uppercase">
                                    <th scope="col" className="px-4 py-3">
                                        Product
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Rate
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Unit
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Quantity
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Discount
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Net Amount
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Total Amount
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-gray-200">
                                {addedProductList?.map((product, index) => (
                                    <tr
                                        key={index} // Use a unique key if available
                                        className={`bg-gray-200 border-b font-medium`}
                                    >
                                        <th scope="row" className="px-3 py-4">
                                            <select
                                                name="product"
                                                id="product"
                                                onChange={(e) =>
                                                    tableProductChangeHandler({
                                                        index,
                                                        productId:
                                                            e.target.value,
                                                    })
                                                }
                                            >
                                                {products?.map((product) => {
                                                    return (
                                                        <option
                                                            key={product._id}
                                                            value={product._id}
                                                        >
                                                            {product.name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </th>
                                        <th scope="row" className="px-3 py-4">
                                            {product.selectedProduct?.rate}
                                        </th>
                                        <td className="px-3 py-4">
                                            {product.selectedProduct?.unit}
                                        </td>
                                        <td className="px-3 py-4">
                                            <input
                                                type="number"
                                                value={product.quantity}
                                                onChange={(e) =>
                                                    tableQtyandDiscChangeHandler(
                                                        {
                                                            index,
                                                            key: "quantity",
                                                            value: e.target
                                                                .value,
                                                        }
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-3 py-4">
                                            <input
                                                type="number"
                                                value={product.discount}
                                                onChange={(e) =>
                                                    tableQtyandDiscChangeHandler(
                                                        {
                                                            index,
                                                            key: "discount",
                                                            value: e.target
                                                                .value,
                                                        }
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-3 py-4">
                                            {product.netAmount}
                                        </td>
                                        <td className="px-3 py-4">
                                            {product.totalAmount}
                                        </td>
                                        <td
                                            className="px-3 py-4 text-blue-600 dark:text-blue-500 hover:cursor-pointer"
                                            onClick={(e) =>
                                                tableRowRemoveHandler(index)
                                            }
                                        >
                                            Remove
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {addedProductList.length > 0 && (
                        <Button
                            variant="contained"
                            type="submit"
                            onClick={(e) => submitHandler(e)}
                            className="cursor-pointer disabled:cursor-none"
                            disabled={createInvoiceLoading}
                            value={createInvoiceLoading? "Processing..":"Submit"}
                        >
                            Submit
                        </Button>
                    )}
                </div>
            )}{" "}
        </>
    );
};

export default Home;
