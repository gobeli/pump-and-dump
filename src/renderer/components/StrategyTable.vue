<template>
  <el-table
      :data="strategies"
      style="width: 100%">
      <el-table-column
        prop="volume"
        label="Volume">
        <template scope="scope">
          {{ scope.row.volume }} BTC
        </template>
      </el-table-column>
      <el-table-column
        prop="buyAt"
        label="Buy at">
        <template scope="scope">
          {{ scope.row.buyAt }}%
        </template>
      </el-table-column>
      <el-table-column
        prop="sellAt"
        label="Sell at">
        <template scope="scope">
          {{ scope.row.sellAt }}%
        </template>
      </el-table-column>
      <el-table-column width="200">
        <template scope="scope">      
          <el-button-group>
            <el-button type="primary" @click="$emit('use-strategy', scope.row)">Use</el-button>
            <el-button type="danger" @click="$emit('delete-strategy', scope.row)">Delete</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
</template>
<script>
  export default {
    name: 'strategy-table',
    props: ['strategies'],
  }
</script>