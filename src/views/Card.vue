<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {API_HOST} from "../apis/constant.ts";
import {NButton, NCard, NModal, NTable} from "naive-ui";
import {CardBalance, CardSecretData, ChargeHistory, TransferHistory} from "../apis/types.ts";

// ------ ------ ------ ------ ------ ------ ------ ------ ------

const route = useRoute();

const cardBalance = ref<CardBalance>();
const transferHistory = ref<[TransferHistory]>();

const cardSecretData = ref<CardSecretData>();
const chargeHistory = ref<[ChargeHistory]>();

const showCvv = ref(false);
const showChargeHistory = ref(false);
const showCharge = ref(false);

// ------ ------ ------ ------ ------ ------ ------ ------ ------

onMounted(async () => {
  console.log("route: ", route);

  await getCardBalance();
  await getTransferHistory();
});

async function getCardBalance() {
  const token = localStorage.getItem("TOKEN");

  const resp = await fetch(`${API_HOST}/api/card/balance/${route.query.gmail}/${route.query.card_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    }
  });
  const data: CardBalance = await resp.json();
  console.log('card-balance: ', data);
  cardBalance.value = data;
}

async function getTransferHistory() {
  const token = localStorage.getItem("TOKEN");

  const resp = await fetch(`${API_HOST}/api/card/transaction_history/${route.query.gmail}/${route.query.card_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    }
  });
  const data: {data: {data: [TransferHistory]}} = await resp.json();
  console.log('transaction-history: ', data);
  transferHistory.value = data.data.data;
}

async function getSecretData() {
  const token = localStorage.getItem("TOKEN");

  const resp = await fetch(`${API_HOST}/api/card/secret_data/${route.query.card_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    }
  });
  const data: CardSecretData = await resp.json();
  console.log('card-secret-data: ', data);
  cardSecretData.value = data;

  showCharge.value = false;
}

async function getChargeHistory() {
  const token = localStorage.getItem("TOKEN");

  const resp = await fetch(`${API_HOST}/api/card/charge_history/${route.query.card_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    }
  });
  const data: [ChargeHistory] = await resp.json();
  console.log('charge-history: ', data);
  chargeHistory.value = data;

  showCharge.value = false;
}

async function charge() {
  const token = localStorage.getItem("TOKEN");

  const resp = await fetch(`${API_HOST}/api/card/charge/${route.query.gmail}/${route.query.card_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    }
  });
  console.log('charge: ', await resp.json());

  showCharge.value = false;
}

// ------ ------ ------ ------ ------ ------ ------ ------ ------

async function showCvvModal() {
  await getSecretData();
  showCvv.value = true;
}

async function showChargeHistoryModal() {
  await getChargeHistory();
  showChargeHistory.value = true;
}

async function showChargeModal() {
  showCharge.value = true;
}

</script>

<template>
  <div>
    <div>
      <h1>卡片详情</h1>
      <p>发卡行: {{cardBalance?.network}}</p>
      <p>卡号: {{cardBalance?.bin}}...{{cardBalance?.last4}}</p>
      <p>余额: ${{cardBalance?.balance.available}}</p>
      <n-button type="error" @click="showCvvModal()">查看CVV</n-button>
      <n-button type="info" @click="showChargeHistoryModal()">查看充值记录</n-button>
      <n-button type="success" @click="showChargeModal()">充值</n-button>
    </div>

    <div>
      <h1>交易记录</h1>
      <n-table>
        <thead>
        <tr>
          <th>类型</th>
          <th>金额</th>
          <th>时间</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="history in transferHistory">
          <td>{{history.type}}</td>
          <td>${{history.amount}}</td>
          <td>{{history.transactionTime}}</td>
        </tr>
        </tbody>
      </n-table>
    </div>


    <n-modal v-model:show="showCvv" class="cvv">
      <n-card>
        <p>卡号：{{ cardSecretData?.card_no}}</p>
        <p>CVV：{{cardSecretData?.cvv}}</p>
        <p>有效期：{{cardSecretData?.exp_month}}/{{cardSecretData?.exp_year}}</p>
      </n-card>
    </n-modal>

    <n-modal v-model:show="showChargeHistory" class="charge_history">
      <n-card>
        <h1>充值记录</h1>
        <n-table>
          <thead>
          <tr>
            <th>金额</th>
            <th>交易哈希</th>
            <th>转账源钱包</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="history in chargeHistory">
            <td>${{history.amount}}</td>
            <td>{{history.tx_hash}}</td>
            <td>{{history.from_wallet}}</td>
          </tr>
          </tbody>
        </n-table>
      </n-card>
    </n-modal>

    <n-modal v-model:show="showCharge" class="charge">
      <n-card>
        <p>Transfer USDT to: <span style="color: #646cff">{{route.query.transfer_wallet}}</span> on <span style="font-size: 20px">polygon</span></p>

        <n-button type="success" @click="charge()">转账完成</n-button>
      </n-card>
    </n-modal>
  </div>
</template>

<style scoped>

</style>
