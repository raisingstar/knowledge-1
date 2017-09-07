var loadCPGGraph = function(userId, before) {
    // 軸を作成
    moment.locale(_LANG);
    var m = moment();
    var labels = [];
    var ymds = [];
    for (var i = 0; i < 28; i++) {
        labels.push(m.format('L'));
        ymds.push(m.format('YYYYMMDD'));
        m.subtract(1, 'days');
    }
    labels.reverse();
    ymds.reverse();
    $.ajax({
        url: _CONTEXT + '/open.account/cp/' + userId,
        type: 'GET',
        timeout: 10000,  // 単位はミリ秒
    }).done(function(result, textStatus, xhr) {
        //console.log(result);
        var valmap = {};
        if (result.length > 0) {
            var hit = false;
            for (var i = 0; i < result.length; i++) {
                var item = result[i];
                if (!hit) {
                    before = item.before;
                }
                valmap[item.ymd] = item.total;
                if (ymds.includes(item.ymd)) {
                    hit = true;
                }
            }
        }
        //console.log(ymds);
        //console.log(valmap);
        var data = [];
        ymds.forEach(function(ymd) {
            if (valmap[ymd]) {
                data.push(valmap[ymd]);
                before = valmap[ymd];
            } else {
                data.push(before);
            }
        });
        
        var ctx = document.getElementById('cpChart').getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Contribution Point',
              data: data,
              backgroundColor: "rgba(0,0,255,0.5)",
              steppedLine: 'before'
            }]
          }
        });
    }).fail(function(xhr, textStatus, error) {
        handleErrorResponse(xhr, textStatus, error);
    });
};

var loadKnowledge = function(userId, offset) {
    var list = [];
    var knowledgeList = new Vue({
        el: '#knowledgeList',
        data: {
            list: list
        }
    });
    $.ajax({
        url: _CONTEXT + '/open.account/knowledge/' + userId,
        type: 'GET',
        timeout: 10000,
    }).done(function(result, textStatus, xhr) {
        result.forEach(function(item) {
            knowledgeList.list.push(item);
        });
    }).fail(function(xhr, textStatus, error) {
        handleErrorResponse(xhr, textStatus, error);
    });
};

var loadAndShowActivity = function(userId, offset) {
    $('#knowledgesArea').hide();
    $('#activityArea').show();
    var activities = [];
    var activityList = new Vue({
        el: '#activityList',
        data: {
            activities: activities
        }
    });
    $.ajax({
        url: _CONTEXT + '/open.account/activity/' + userId,
        type: 'GET',
        timeout: 10000,
    }).done(function(result, textStatus, xhr) {
        console.log(result);
        result.list.forEach(function(item) {
            activityList.activities.push(item);
        });
    }).fail(function(xhr, textStatus, error) {
        handleErrorResponse(xhr, textStatus, error);
    });
};


$(document).ready(function() {
    var userId = $('#userId').val();
    var before = $('#point').val();
    // グラフをロード
    loadCPGGraph(userId, before);
    
    var tab = new Vue({
        el: '#tabArea',
        data: {},
        methods: {
            showKnowledge: function (event) {
            },
            showLike: function (event) {
            },
            showActivity: function (event) {
                loadAndShowActivity(userId);
            }
        }
    });
});
