/* 
    mockdata used to test the swiper functionalities.
*/
export const foodplacespics/*: Array<{name: string, Image: any, caption: string}>*/ = [
    {
        restID: "eleventh",
        name: 'Jack in the box',
        imgList:[require('../assets/images/jackinthebox.jpeg'), require('../assets/images/sonic.jpeg')],
        price: 12,
     },
    {
        restID: "cc",
        name: 'Mcdonalds',
        imgList:[require('../assets/images/mcdonalds.jpeg')],
        price: 165,
    },
    {
        restID: "scfm",
        name: 'sonic',
        Image: require('../assets/images/sonic.jpeg'),
        caption: 11,
    },
    {
        restID: "walcafe",
        name: 'Olive garden',
        Image: require('../assets/images/olivegarden.jpeg'),
        caption: 16,
    },
    {
        restID: "perk",
        name: 'taco bell',
        Image: require('../assets/images/tacobell.jpeg'),
        caption: 19,
    },
]

export default foodplacespics;