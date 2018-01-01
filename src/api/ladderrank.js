import Vue from 'vue';
import Store from '@/store';
import UiString from './uistring';

const ranks = [
    "Unranked",
    "Bronze 3",
    "Bronze 2",
    "Bronze 1",
    "Silver 3",
    "Silver 2",
    "Silver 1",
    "Gold 3",
    "Gold 2",
    "Gold 1",
    "Platinum 3",
    "Platinum 2",
    "Platinum 1",
    "Diamond 3",
    "Diamond 2",
    "Diamond 1",
];

export default {
    getRankName(rankId) {
        return ranks[rankId];
    }
};
