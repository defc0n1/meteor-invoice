 # -*- coding: utf-8 -*
from datetime import datetime
ITEM = {
    'key':'123456789',
    'name': 'name',
    'group': 'group',
    'cost_price': '1',
    'price': '2',
    'price_1': '3',
    'price_2': '4',
    'price_3': '5',
    'price_4': '6',
    'inner_box': '7',
    'outer_box': '8',
    'ean': '9',
    'quantity': '10',
    'gln_number': '12345',
}
ITEM1 = {
    "cost_price" : 450,
    "ean" : "5707283700003",
    "gln_number" : "5707283700003",
    "group" : "9",
    "inner_box" : 36,
    "key" : "70000",
    "name" : "Neglelak",
    "outer_box" : 288,
    "price" : 1050,
    "price_1" : 1000,
    "price_2" : 1000,
    "price_3" : 1000,
    "price_4" : 1000,
    "quantity" : 36
}
DEPTOR = {
	"address" : "Annemiek Bangma",
	"attention" : "",
	"city" : "Rd Waddinxveen",
	"email" : "",
	"fax" : "",
	"key" : "87274000",
	"name" : "This is it/Intertoys Holland",
	"phone" : "",
	"gln" : "123",
	"gln_group" : "supergros",
	"search_name" : "THIS IS IT/INTERTOYS HOLLAND",
	"zip" : "2742"
}
INVOICE = {
    "address" : "Bjødstrupvej 18",
    "address_1" : "",
    "amount" : 9563,
    "attention" : "Bogholderi indkøb",
    "city" : "Højbjerg",
    "comments" : [
        "Ordrenr. 1197629"
    ],
    "customer_number" : "87274000",
    "customer_order_number" : "1197629",
    "delivery_date" : "",
    "deptor_number" : "89303030",
    "edi" : "Nej",
    "entries" : [
        {
            "offsetting_account" : "",
            "text" : "Faktura 91085",
            "tax_code" : "2",
            "amount" : -7650,
            "record_number" : 91085,
            "account_number" : "1000",
            "key" : 328727,
            "date" : datetime.now(),
            "type" : "Faktura"
        }
    ],
    "entry_number" : 328728,
    "item_entries" : [
        {
            "item_number" : "70000",
            "contact_number" : 91085,
            "total_price" : -7650,
            "item_price" : 850,
            "item_group" : "9",
            "record_number" : 91085,
            "key" : 1069707,
            "date" : datetime.now(),
            "type" : "Salg",
            "quantity" : -9
        },
        {
            "item_number" : "70000",
            "total_price" : -7650,
            "item_price" : 850,
            "item_group" : "9",
            "record_number" : 91085,
            "key" : 1069707,
            "date" : datetime.now(),
            "type" : "Salg",
            "quantity" : -9
        }
    ],
    "key" : 91085,
    "last_updated" : datetime.now(),
    "lines" : [
        {
            "item_number" : "70000",
            "info" : "Neglelak",
            "last_updated" : datetime.now(),
            "ean" : "",
            "total_with_tax" : 9563,
            "price" : 850,
            "total_without_tax" : 7650,
            "quantity" : 9
        }
    ],
    "name" : "Dansk Supermarked",
    "name_1" : "Att.: Jonas Mandix",
    "order_date" : datetime.now(),
    "posting_date" : datetime.now(),
    "posting_group" : "V",
    "total_with_tax" : 0,
    "type" : "invoice",
    "zip" : "8270"
}
