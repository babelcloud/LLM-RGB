# 012_linux_terminal

## Prompt

Consider the following Linux terminal log

----------------- Log Start -----------------
make install-app
Services run locally: agent

 ✔ Preload service images, elapsed 1m 23s
Target cluster 'https://0.0.0.0:40180' (nodes: babelcloud-control-plane)

@@ create configmap/babel-entrypoint-config-ver-4 (v1) namespace: babel-system @@
  ...
116,116         }
    117 +
    118 +       location =/favicon.ico {
    119 +         return 404;
    120 +       }
    121 +
    122 +       location /assets/ {
    123 +         proxy_pass https://gru-public-assets.s3.us-west-2.amazonaws.com/;
    124 +         proxy_set_header        Host                    gru-public-assets.s3.us-west-2.amazonaws.com;
    125 +         proxy_set_header        X-Host                  gru-public-assets.s3.us-west-2.amazonaws.com;
    126 +         proxy_set_header        X-Real-IP               $remote_addr;
    127 +         proxy_set_header        X-Forwarded-For         $proxy_add_x_forwarded_for;
    128 +         proxy_set_header        X-Forwarded-Protocol    $http_x_forwarded_proto;
    129 +       }
117,130       }
118,131
@@ update deployment/babel-agent (apps/v1) namespace: babel-system @@
  ...
479,479   spec:
480     -   progressDeadlineSeconds: 600
481,480     replicas: 0
482     -   revisionHistoryLimit: 10
483,481     selector:
484,482       matchLabels:
  ...
486,484         module: babel-agent
487     -   strategy:
488     -     rollingUpdate:
489     -       maxSurge: 25%
490     -       maxUnavailable: 25%
491     -     type: RollingUpdate
492,485     template:
493,486       metadata:
494     -       creationTimestamp: null
495,487         labels:
496,488           kapp.k14s.io/app: "1721490507501923000"
  ...
605,597           - name: NODE_OPTIONS
    598 +           value: ""
606,599           - name: USAGE_API_HOST
607,600             value: http://babel-controller.babel-system.svc.cluster.local:80
  ...
656,649           - name: SANDBOX_NODE_GROUP
    650 +           value: ""
657,651           - name: AI_PROXY_ENDPOINT
658,652             value: http://babel-ai-proxy:3007
  ...
716,710                 name: babel-infra-secret
717     -         - name: STAKATER_BABEL_INFRA_CONFIG_CONFIGMAP
718     -           value: d9ba06ad9034baa5cdf3899247ad613ddd7a9f33
719     -         - name: STAKATER_BABEL_INFRA_SECRET_SECRET
720     -           value: e6ecc83849d03568a0553f79d39af36e3f71ffe1
721     -         image: ghcr.io/babelcloud/babel-agent:6b671df
    711 +         image: ghcr.io/babelcloud/babel-agent:118c3c7
722,712           imagePullPolicy: IfNotPresent
723,713           livenessProbe:
  ...
726,716             periodSeconds: 10
727     -           successThreshold: 1
728,717             tcpSocket:
729,718               port: 8083
  ...
735,724             periodSeconds: 10
736     -           successThreshold: 1
737,725             tcpSocket:
738,726               port: 8083
739,727             timeoutSeconds: 3
740     -         resources: {}
741     -         terminationMessagePath: /dev/termination-log
742     -         terminationMessagePolicy: File
743,728           volumeMounts:
744,729           - mountPath: /var/cache/babel-agent/langchain
745,730             name: langchain-cache
746     -       dnsPolicy: ClusterFirst
747,731         imagePullSecrets:
748,732         - name: regcred
749     -       restartPolicy: Always
750     -       schedulerName: default-scheduler
751     -       securityContext: {}
752     -       serviceAccount: babel-agent
    733 +       nodeSelector: null
753,734         serviceAccountName: babel-agent
754     -       terminationGracePeriodSeconds: 30
755,735         volumes:
756,736         - name: langchain-cache
@@ update deployment/babel-ai-proxy (apps/v1) namespace: babel-system @@
  ...
252,252   spec:
253     -   progressDeadlineSeconds: 600
254,253     replicas: 1
255     -   revisionHistoryLimit: 10
256,254     selector:
257,255       matchLabels:
  ...
259,257         module: babel-ai-proxy
260     -   strategy:
261     -     rollingUpdate:
262     -       maxSurge: 25%
263     -       maxUnavailable: 25%
264     -     type: RollingUpdate
265,258     template:
266,259       metadata:
267     -       creationTimestamp: null
268,260         labels:
269,261           kapp.k14s.io/app: "1721490507501923000"
  ...
295,287                 key: anthropic.apikeys
    288 +               name: babel-infra-secret
    289 +         - name: GOOGLE_GENAI_API_KEYS
    290 +           valueFrom:
    291 +             secretKeyRef:
    292 +               key: google.genai.apikeys
296,293                 name: babel-infra-secret
297,294           - name: DEFAULT_KEY_PROVIDER
  ...
334,331           - name: NODE_OPTIONS
335     -         - name: STAKATER_BABEL_INFRA_CONFIG_CONFIGMAP
336     -           value: d9ba06ad9034baa5cdf3899247ad613ddd7a9f33
337     -         - name: STAKATER_BABEL_INFRA_SECRET_SECRET
338     -           value: e6ecc83849d03568a0553f79d39af36e3f71ffe1
339     -         image: ghcr.io/babelcloud/babel-ai-proxy:25fe4ad
    332 +           value: ""
    333 +         image: ghcr.io/babelcloud/babel-ai-proxy:4651f5f
340,334           imagePullPolicy: IfNotPresent
341,335           livenessProbe:
  ...
344,338             periodSeconds: 10
345     -           successThreshold: 1
346,339             tcpSocket:
347,340               port: 3007
  ...
353,346             periodSeconds: 10
354     -           successThreshold: 1
355,347             tcpSocket:
356,348               port: 3007
357,349             timeoutSeconds: 3
358     -         resources: {}
359     -         terminationMessagePath: /dev/termination-log
360     -         terminationMessagePolicy: File
361     -       dnsPolicy: ClusterFirst
362,350         imagePullSecrets:
363,351         - name: regcred
364     -       restartPolicy: Always
365     -       schedulerName: default-scheduler
366     -       securityContext: {}
367     -       terminationGracePeriodSeconds: 30
    352 +       nodeSelector: null
368,353
@@ update deployment/babel-controller (apps/v1) namespace: babel-system @@
  ...
540,540   spec:
541     -   progressDeadlineSeconds: 600
542,541     replicas: 1
543     -   revisionHistoryLimit: 10
544,542     selector:
545,543       matchLabels:
  ...
547,545         module: babel-controller
548     -   strategy:
549     -     rollingUpdate:
550     -       maxSurge: 25%
551     -       maxUnavailable: 25%
552     -     type: RollingUpdate
553,546     template:
554,547       metadata:
555     -       creationTimestamp: null
556,548         labels:
557,549           kapp.k14s.io/app: "1721490507501923000"
  ...
563,555           - name: BABELCLOUD_REVISION
564     -           value: 67111840128b94db1142edcecfa944a598a9a722
    556 +           value: 14a437666914ab31c0c425a9c685aabaecefbd30
565,557           - name: BABELCLOUD_ENVIRONMENT
566,558             valueFrom:
  ...
680,672           - name: BABELCLOUD_RUNTIME_NODE_GROUP
    673 +           value: ""
681,674           - name: BABELCLOUD_RUNTIME_OPENAI_PROXY
682,675             valueFrom:
  ...
802,795           - name: STRIPE_PAYMENT_COUPON_ID
    796 +           value: ""
803,797           - name: STRIPE_SUB_COUPON_ID
    798 +           value: ""
804,799           - name: STRIPE_ENABLE_WECHAT
805,800             value: "false"
  ...
807,802             value: "false"
808     -         - name: STAKATER_BABEL_INFRA_CONFIG_CONFIGMAP
809     -           value: d9ba06ad9034baa5cdf3899247ad613ddd7a9f33
810     -         - name: STAKATER_BABEL_INFRA_SECRET_SECRET
811     -           value: e6ecc83849d03568a0553f79d39af36e3f71ffe1
812     -         image: ghcr.io/babelcloud/babel-controller:7bf5ec0
    803 +         image: ghcr.io/babelcloud/babel-controller:1bc6250
813,804           imagePullPolicy: IfNotPresent
814,805           livenessProbe:
  ...
817,808             periodSeconds: 10
818     -           successThreshold: 1
819,809             tcpSocket:
820,810               port: 8080
  ...
826,816             periodSeconds: 10
827     -           successThreshold: 1
828,817             tcpSocket:
829,818               port: 8080
830,819             timeoutSeconds: 3
831     -         resources: {}
832     -         terminationMessagePath: /dev/termination-log
833     -         terminationMessagePolicy: File
834,820           volumeMounts:
835,821           - mountPath: /opentelemetry
  ...
837,823             readOnly: true
838     -       dnsPolicy: ClusterFirst
839,824         imagePullSecrets:
840,825         - name: regcred
  ...
848,833           name: install-opentelemetry-java-agent
849     -         resources: {}
850     -         terminationMessagePath: /dev/termination-log
851     -         terminationMessagePolicy: File
852,834           volumeMounts:
853,835           - mountPath: /opentelemetry
854,836             name: opentelemetry
855     -       restartPolicy: Always
856     -       schedulerName: default-scheduler
857     -       securityContext: {}
858     -       serviceAccount: babel-controller
    837 +       nodeSelector: null
859,838         serviceAccountName: babel-controller
860     -       terminationGracePeriodSeconds: 30
861,839         volumes:
862,840         - emptyDir: {}
@@ update deployment/babel-entrypoint (apps/v1) namespace: babel-system @@
  ...
  9,  9         kind: ConfigMap
 10     -       name: babel-entrypoint-config-ver-3
     10 +       name: babel-entrypoint-config-ver-4
 11, 11     creationTimestamp: "2024-07-20T15:48:28Z"
 12, 12     generation: 6
  ...
296,296         - configMap:
297     -           name: babel-entrypoint-config-ver-3
    297 +           name: babel-entrypoint-config-ver-4
298,298           name: babel-entrypoint-config
299,299
@@ update deployment/babel-frontend (apps/v1) namespace: babel-system @@
  ...
166,166                 name: babel-infra-config
167     -         image: ghcr.io/babelcloud/babel-frontend:c9306d0
    167 +         image: ghcr.io/babelcloud/babel-frontend:3b459cc
168,168           imagePullPolicy: IfNotPresent
169,169           livenessProbe:
@@ update deployment/babel-history (apps/v1) namespace: babel-system @@
  ...
190,190   spec:
191     -   progressDeadlineSeconds: 600
192,191     replicas: 1
193     -   revisionHistoryLimit: 10
194,192     selector:
195,193       matchLabels:
  ...
197,195         module: babel-history
198     -   strategy:
199     -     rollingUpdate:
200     -       maxSurge: 25%
201     -       maxUnavailable: 25%
202     -     type: RollingUpdate
203,196     template:
204,197       metadata:
205     -       creationTimestamp: null
206,198         labels:
207,199           kapp.k14s.io/app: "1721490507501923000"
  ...
230,222             value: babel-history
231     -         - name: STAKATER_BABEL_INFRA_CONFIG_CONFIGMAP
232     -           value: d9ba06ad9034baa5cdf3899247ad613ddd7a9f33
233,223           image: ghcr.io/babelcloud/babel-history:72ec027
234,224           imagePullPolicy: IfNotPresent
  ...
238,228             periodSeconds: 10
239     -           successThreshold: 1
240,229             tcpSocket:
241,230               port: 18080
  ...
247,236             periodSeconds: 10
248     -           successThreshold: 1
249,237             tcpSocket:
250,238               port: 18080
251,239             timeoutSeconds: 3
252     -         resources: {}
253     -         terminationMessagePath: /dev/termination-log
254     -         terminationMessagePolicy: File
255,240           volumeMounts:
256,241           - mountPath: /repo
257,242             name: repo
258     -       dnsPolicy: ClusterFirst
259,243         imagePullSecrets:
260,244         - name: regcred
261     -       restartPolicy: Always
262     -       schedulerName: default-scheduler
263     -       securityContext: {}
264     -       terminationGracePeriodSeconds: 30
    245 +       nodeSelector: null
265,246         volumes:
266,247         - name: repo
@@ update deployment/babel-observ (apps/v1) namespace: babel-system @@
  ...
183,183   spec:
184     -   progressDeadlineSeconds: 600
185,184     replicas: 1
186     -   revisionHistoryLimit: 10
187,185     selector:
188,186       matchLabels:
  ...
190,188         module: babel-observ
191     -   strategy:
192     -     rollingUpdate:
193     -       maxSurge: 25%
194     -       maxUnavailable: 25%
195     -     type: RollingUpdate
196,189     template:
197,190       metadata:
198     -       creationTimestamp: null
199,191         labels:
200,192           kapp.k14s.io/app: "1721490507501923000"
  ...
222,214             value: http://datakit-service.datakit:9529
223     -         - name: STAKATER_BABEL_INFRA_CONFIG_CONFIGMAP
224     -           value: d9ba06ad9034baa5cdf3899247ad613ddd7a9f33
225,215           image: ghcr.io/babelcloud/babel-observ:6ec92ae
226,216           imagePullPolicy: IfNotPresent
  ...
230,220             periodSeconds: 10
231     -           successThreshold: 1
232,221             tcpSocket:
233,222               port: 3005
  ...
239,228             periodSeconds: 10
240     -           successThreshold: 1
241,229             tcpSocket:
242,230               port: 3005
243,231             timeoutSeconds: 3
244     -         resources: {}
245     -         terminationMessagePath: /dev/termination-log
246     -         terminationMessagePolicy: File
247     -       dnsPolicy: ClusterFirst
248,232         imagePullSecrets:
249,233         - name: regcred
250     -       restartPolicy: Always
251     -       schedulerName: default-scheduler
252     -       securityContext: {}
253     -       terminationGracePeriodSeconds: 30
    234 +       nodeSelector: null
254,235
@@ update deployment/babel-storage (apps/v1) namespace: babel-system @@
  ...
296,296   spec:
297     -   progressDeadlineSeconds: 600
298,297     replicas: 1
299     -   revisionHistoryLimit: 10
300,298     selector:
301,299       matchLabels:
  ...
303,301         module: babel-storage
304     -   strategy:
305     -     rollingUpdate:
306     -       maxSurge: 25%
307     -       maxUnavailable: 25%
308     -     type: RollingUpdate
309,302     template:
310,303       metadata:
311     -       creationTimestamp: null
312,304         labels:
313,305           kapp.k14s.io/app: "1721490507501923000"
  ...
404,396           - name: NODE_OPTIONS
405     -         - name: STAKATER_BABEL_INFRA_CONFIG_CONFIGMAP
406     -           value: d9ba06ad9034baa5cdf3899247ad613ddd7a9f33
407     -         - name: STAKATER_BABEL_INFRA_SECRET_SECRET
408     -           value: e6ecc83849d03568a0553f79d39af36e3f71ffe1
    397 +           value: ""
409,398           image: ghcr.io/babelcloud/babel-storage:d092ae8
410,399           imagePullPolicy: IfNotPresent
  ...
414,403             periodSeconds: 10
415     -           successThreshold: 1
416,404             tcpSocket:
417,405               port: 4003
  ...
423,411             periodSeconds: 10
424     -           successThreshold: 1
425,412             tcpSocket:
426,413               port: 4003
427,414             timeoutSeconds: 3
428     -         resources: {}
429     -         terminationMessagePath: /dev/termination-log
430     -         terminationMessagePolicy: File
431     -       dnsPolicy: ClusterFirst
432,415         imagePullSecrets:
433,416         - name: regcred
434     -       restartPolicy: Always
435     -       schedulerName: default-scheduler
436     -       securityContext: {}
437     -       terminationGracePeriodSeconds: 30
    417 +       nodeSelector: null
438,418
@@ update deployment/babel-toolbox (apps/v1) namespace: babel-tenant @@
  ...
190,190           - name: KUBERNETES_PORT_443_TCP_PORT
191     -         image: ghcr.io/babelcloud/babel-toolbox:af0249a
    191 +         image: ghcr.io/babelcloud/babel-toolbox:f3ecd01
192,192           imagePullPolicy: IfNotPresent
193,193           livenessProbe:
@@ update service/babel-toolbox (v1) namespace: babel-tenant @@
  ...
  2,  2   metadata:
  3     -   annotations: {}
  4,  3     creationTimestamp: "2024-07-20T15:48:28Z"
  5,  4     labels:
  ...
 54, 53     clusterIP: 10.96.141.65
 55     -   clusterIPs:
 56     -   - 10.96.141.65
 57     -   internalTrafficPolicy: Cluster
 58     -   ipFamilies:
 59     -   - IPv4
 60     -   ipFamilyPolicy: SingleStack
 61, 54     ports:
 62     -   - name: port0
 63     -     port: 3010
 64     -     protocol: TCP
 65     -     targetPort: 46315
     55 +   - port: 3010
 66, 56     selector:
 67     -     kwt.cppforlife.com/net: "true"
 68     -   sessionAffinity: None
     57 +     kapp.k14s.io/app: "1721490507501923000"
     58 +     module: babel-toolbox
 69, 59     type: ClusterIP
 70, 60
@@ update deployment/babel-vectorstore (apps/v1) namespace: babel-system @@
  ...
256,256   spec:
257     -   progressDeadlineSeconds: 600
258,257     replicas: 1
259     -   revisionHistoryLimit: 10
260,258     selector:
261,259       matchLabels:
  ...
263,261         module: babel-vectorstore
264     -   strategy:
265     -     rollingUpdate:
266     -       maxSurge: 25%
267     -       maxUnavailable: 25%
268     -     type: RollingUpdate
269,262     template:
270,263       metadata:
271     -       creationTimestamp: null
272,264         labels:
273,265           kapp.k14s.io/app: "1721490507501923000"
  ...
331,323           - name: NODE_OPTIONS
    324 +           value: ""
332,325           - name: OPENAI_PROXY
333,326             valueFrom:
  ...
336,329                 name: babel-infra-secret
337     -         - name: STAKATER_BABEL_INFRA_CONFIG_CONFIGMAP
338     -           value: d9ba06ad9034baa5cdf3899247ad613ddd7a9f33
339     -         - name: STAKATER_BABEL_INFRA_SECRET_SECRET
340     -           value: e6ecc83849d03568a0553f79d39af36e3f71ffe1
341,330           image: ghcr.io/babelcloud/babel-vectorstore:8e9fbc7
342,331           imagePullPolicy: IfNotPresent
  ...
346,335             periodSeconds: 10
347     -           successThreshold: 1
348,336             tcpSocket:
349,337               port: 4006
  ...
355,343             periodSeconds: 10
356     -           successThreshold: 1
357,344             tcpSocket:
358,345               port: 4006
359,346             timeoutSeconds: 3
360     -         resources: {}
361     -         terminationMessagePath: /dev/termination-log
362     -         terminationMessagePolicy: File
363     -       dnsPolicy: ClusterFirst
364,347         imagePullSecrets:
365,348         - name: regcred
366     -       restartPolicy: Always
367     -       schedulerName: default-scheduler
368     -       securityContext: {}
369     -       terminationGracePeriodSeconds: 30
    349 +       nodeSelector: null
370,350

Changes

Namespace     Name                           Kind        Age  Op      Op st.  Wait to    Rs  Ri
babel-system  babel-agent                    Deployment  39d  update  -       reconcile  ok  -
^             babel-ai-proxy                 Deployment  39d  update  -       reconcile  ok  -
^             babel-controller               Deployment  39d  update  -       reconcile  ok  -
^             babel-entrypoint               Deployment  39d  update  -       reconcile  ok  -
^             babel-entrypoint-config-ver-4  ConfigMap   -    create  -       reconcile  -   -
^             babel-frontend                 Deployment  39d  update  -       reconcile  ok  -
^             babel-history                  Deployment  39d  update  -       reconcile  ok  -
^             babel-observ                   Deployment  39d  update  -       reconcile  ok  -
^             babel-storage                  Deployment  39d  update  -       reconcile  ok  -
^             babel-vectorstore              Deployment  39d  update  -       reconcile  ok  -
babel-tenant  babel-toolbox                  Deployment  39d  update  -       reconcile  ok  -
^             babel-toolbox                  Service     39d  update  -       reconcile  ok  -

Op:      1 create, 0 delete, 11 update, 0 noop, 0 exists
Wait to: 12 reconcile, 0 delete, 0 noop

2:43:43PM: ---- applying 1 changes [0/12 done] ----
2:43:43PM: create configmap/babel-entrypoint-config-ver-4 (v1) namespace: babel-system
2:43:43PM: ---- waiting on 1 changes [0/12 done] ----
2:43:43PM: ok: reconcile configmap/babel-entrypoint-config-ver-4 (v1) namespace: babel-system
2:43:43PM: ---- applying 8 changes [1/12 done] ----
2:43:43PM: update deployment/babel-observ (apps/v1) namespace: babel-system
2:43:43PM: update deployment/babel-ai-proxy (apps/v1) namespace: babel-system
2:43:43PM: update deployment/babel-vectorstore (apps/v1) namespace: babel-system
2:43:43PM: update deployment/babel-toolbox (apps/v1) namespace: babel-tenant
2:43:43PM: update deployment/babel-storage (apps/v1) namespace: babel-system
2:43:43PM: update service/babel-toolbox (v1) namespace: babel-tenant
2:43:43PM: update deployment/babel-entrypoint (apps/v1) namespace: babel-system
2:43:43PM: update deployment/babel-history (apps/v1) namespace: babel-system
2:43:43PM: ---- waiting on 8 changes [1/12 done] ----
2:43:43PM: ok: reconcile service/babel-toolbox (v1) namespace: babel-tenant
2:43:43PM: ongoing: reconcile deployment/babel-history (apps/v1) namespace: babel-system
2:43:43PM:  ^ Waiting for generation 7 to be observed
2:43:43PM:  L ok: waiting on replicaset/babel-history-7c57b4cf49 (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-history-76b97d9cdb (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-history-54657b5cdd (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on pod/babel-history-76b97d9cdb-cqqfp (v1) namespace: babel-system
2:43:43PM: ongoing: reconcile deployment/babel-storage (apps/v1) namespace: babel-system
2:43:43PM:  ^ Waiting for generation 9 to be observed
2:43:43PM:  L ok: waiting on replicaset/babel-storage-8bd4d9577 (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-storage-78d94d795b (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-storage-78498bfd6d (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-storage-5d6f4bc668 (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-storage-576bd799f4 (apps/v1) namespace: babel-system
2:43:43PM:  L ongoing: waiting on pod/babel-storage-8bd4d9577-fhwtj (v1) namespace: babel-system
2:43:43PM:     ^ Pending
2:43:43PM:  L ok: waiting on pod/babel-storage-78498bfd6d-jg8cb (v1) namespace: babel-system
2:43:43PM: ongoing: reconcile deployment/babel-vectorstore (apps/v1) namespace: babel-system
2:43:43PM:  ^ Waiting for generation 9 to be observed
2:43:43PM:  L ok: waiting on replicaset/babel-vectorstore-7f79466dd8 (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-vectorstore-7c466df6f6 (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-vectorstore-77d47585b4 (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-vectorstore-6fb88bf7f6 (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-vectorstore-55d96b7c7 (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on pod/babel-vectorstore-7c466df6f6-2wnsw (v1) namespace: babel-system
2:43:43PM:  L ongoing: waiting on pod/babel-vectorstore-55d96b7c7-7dfhx (v1) namespace: babel-system
2:43:43PM:     ^ Pending
2:43:43PM: ongoing: reconcile deployment/babel-entrypoint (apps/v1) namespace: babel-system
2:43:43PM:  ^ Waiting for generation 8 to be observed
2:43:43PM:  L ok: waiting on replicaset/babel-entrypoint-df6ff574c (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-entrypoint-b945d86b6 (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-entrypoint-676744787b (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-entrypoint-6488fbb7dd (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on pod/babel-entrypoint-df6ff574c-4g87p (v1) namespace: babel-system
2:43:43PM:  L ongoing: waiting on pod/babel-entrypoint-b945d86b6-jjhl2 (v1) namespace: babel-system
2:43:43PM:     ^ Pending
2:43:43PM: ongoing: reconcile deployment/babel-toolbox (apps/v1) namespace: babel-tenant
2:43:43PM:  ^ Waiting for generation 10 to be observed
2:43:43PM:  L ok: waiting on replicaset/babel-toolbox-c4d579fb7 (apps/v1) namespace: babel-tenant
2:43:43PM:  L ok: waiting on replicaset/babel-toolbox-7dd79dc48b (apps/v1) namespace: babel-tenant
2:43:43PM:  L ok: waiting on replicaset/babel-toolbox-76fbb85c4b (apps/v1) namespace: babel-tenant
2:43:43PM:  L ok: waiting on replicaset/babel-toolbox-75559ffd6f (apps/v1) namespace: babel-tenant
2:43:43PM:  L ok: waiting on replicaset/babel-toolbox-649569bf96 (apps/v1) namespace: babel-tenant
2:43:43PM:  L ongoing: waiting on pod/babel-toolbox-c4d579fb7-czrnz (v1) namespace: babel-tenant
2:43:43PM:     ^ Pending
2:43:43PM:  L ok: waiting on pod/babel-toolbox-76fbb85c4b-f5kxs (v1) namespace: babel-tenant
2:43:43PM: ongoing: reconcile deployment/babel-observ (apps/v1) namespace: babel-system
2:43:43PM:  ^ Waiting for generation 5 to be observed
2:43:43PM:  L ok: waiting on replicaset/babel-observ-5f6958659d (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-observ-5d4b864bbc (apps/v1) namespace: babel-system
2:43:43PM:  L ongoing: waiting on pod/babel-observ-5f6958659d-d5zs8 (v1) namespace: babel-system
2:43:43PM:     ^ Pending
2:43:43PM:  L ok: waiting on pod/babel-observ-5d4b864bbc-mhdxz (v1) namespace: babel-system
2:43:43PM: ongoing: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
2:43:43PM:  ^ Waiting for generation 11 to be observed
2:43:43PM:  L ok: waiting on replicaset/babel-ai-proxy-c4bbf9b54 (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-ai-proxy-847ffd96f4 (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-ai-proxy-6fcc94545d (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-ai-proxy-6fc98f56f9 (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-ai-proxy-664879578b (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-ai-proxy-657cbdcdf9 (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-ai-proxy-64fd6dc7c8 (apps/v1) namespace: babel-system
2:43:43PM:  L ongoing: waiting on pod/babel-ai-proxy-847ffd96f4-czm8l (v1) namespace: babel-system
2:43:43PM:     ^ Pending: ContainerCreating
2:43:43PM:  L ok: waiting on pod/babel-ai-proxy-64fd6dc7c8-s8mrv (v1) namespace: babel-system
2:43:43PM: ---- waiting on 7 changes [2/12 done] ----
2:43:43PM: ongoing: reconcile deployment/babel-observ (apps/v1) namespace: babel-system
2:43:43PM:  ^ Waiting for generation 5 to be observed
2:43:43PM:  L ok: waiting on replicaset/babel-observ-5f6958659d (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-observ-5d4b864bbc (apps/v1) namespace: babel-system
2:43:43PM:  L ongoing: waiting on pod/babel-observ-5f6958659d-d5zs8 (v1) namespace: babel-system
2:43:43PM:     ^ Pending: ContainerCreating
2:43:43PM:  L ok: waiting on pod/babel-observ-5d4b864bbc-mhdxz (v1) namespace: babel-system
2:43:43PM: ongoing: reconcile deployment/babel-toolbox (apps/v1) namespace: babel-tenant
2:43:43PM:  ^ Waiting for generation 10 to be observed
2:43:43PM:  L ok: waiting on replicaset/babel-toolbox-c4d579fb7 (apps/v1) namespace: babel-tenant
2:43:43PM:  L ok: waiting on replicaset/babel-toolbox-7dd79dc48b (apps/v1) namespace: babel-tenant
2:43:43PM:  L ok: waiting on replicaset/babel-toolbox-76fbb85c4b (apps/v1) namespace: babel-tenant
2:43:43PM:  L ok: waiting on replicaset/babel-toolbox-75559ffd6f (apps/v1) namespace: babel-tenant
2:43:43PM:  L ok: waiting on replicaset/babel-toolbox-649569bf96 (apps/v1) namespace: babel-tenant
2:43:43PM:  L ongoing: waiting on pod/babel-toolbox-c4d579fb7-czrnz (v1) namespace: babel-tenant
2:43:43PM:     ^ Pending: ContainerCreating
2:43:43PM:  L ok: waiting on pod/babel-toolbox-76fbb85c4b-f5kxs (v1) namespace: babel-tenant
2:43:43PM: ongoing: reconcile deployment/babel-storage (apps/v1) namespace: babel-system
2:43:43PM:  ^ Waiting for generation 9 to be observed
2:43:43PM:  L ok: waiting on replicaset/babel-storage-8bd4d9577 (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-storage-78d94d795b (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-storage-78498bfd6d (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-storage-5d6f4bc668 (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-storage-576bd799f4 (apps/v1) namespace: babel-system
2:43:43PM:  L ongoing: waiting on pod/babel-storage-8bd4d9577-fhwtj (v1) namespace: babel-system
2:43:43PM:     ^ Pending: ContainerCreating
2:43:43PM:  L ok: waiting on pod/babel-storage-78498bfd6d-jg8cb (v1) namespace: babel-system
2:43:43PM: ongoing: reconcile deployment/babel-entrypoint (apps/v1) namespace: babel-system
2:43:43PM:  ^ Waiting for generation 8 to be observed
2:43:43PM:  L ok: waiting on replicaset/babel-entrypoint-df6ff574c (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-entrypoint-b945d86b6 (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-entrypoint-676744787b (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on replicaset/babel-entrypoint-6488fbb7dd (apps/v1) namespace: babel-system
2:43:43PM:  L ok: waiting on pod/babel-entrypoint-df6ff574c-4g87p (v1) namespace: babel-system
2:43:43PM:  L ongoing: waiting on pod/babel-entrypoint-b945d86b6-jjhl2 (v1) namespace: babel-system
2:43:43PM:     ^ Pending: ContainerCreating
2:43:46PM: ongoing: reconcile deployment/babel-observ (apps/v1) namespace: babel-system
2:43:46PM:  ^ Waiting for 1 unavailable replicas
2:43:46PM:  L ok: waiting on replicaset/babel-observ-5f6958659d (apps/v1) namespace: babel-system
2:43:46PM:  L ok: waiting on replicaset/babel-observ-5d4b864bbc (apps/v1) namespace: babel-system
2:43:46PM:  L ongoing: waiting on pod/babel-observ-5f6958659d-d5zs8 (v1) namespace: babel-system
2:43:46PM:     ^ Condition Ready is not True (False)
2:43:46PM:  L ok: waiting on pod/babel-observ-5d4b864bbc-mhdxz (v1) namespace: babel-system
2:43:46PM: ongoing: reconcile deployment/babel-storage (apps/v1) namespace: babel-system
2:43:46PM:  ^ Waiting for 1 unavailable replicas
2:43:46PM:  L ok: waiting on replicaset/babel-storage-8bd4d9577 (apps/v1) namespace: babel-system
2:43:46PM:  L ok: waiting on replicaset/babel-storage-78d94d795b (apps/v1) namespace: babel-system
2:43:46PM:  L ok: waiting on replicaset/babel-storage-78498bfd6d (apps/v1) namespace: babel-system
2:43:46PM:  L ok: waiting on replicaset/babel-storage-5d6f4bc668 (apps/v1) namespace: babel-system
2:43:46PM:  L ok: waiting on replicaset/babel-storage-576bd799f4 (apps/v1) namespace: babel-system
2:43:46PM:  L ongoing: waiting on pod/babel-storage-8bd4d9577-fhwtj (v1) namespace: babel-system
2:43:46PM:     ^ Condition Ready is not True (False)
2:43:46PM:  L ok: waiting on pod/babel-storage-78498bfd6d-jg8cb (v1) namespace: babel-system
2:43:46PM: ongoing: reconcile deployment/babel-history (apps/v1) namespace: babel-system
2:43:46PM:  ^ Waiting for 1 unavailable replicas
2:43:46PM:  L ok: waiting on replicaset/babel-history-7c57b4cf49 (apps/v1) namespace: babel-system
2:43:46PM:  L ok: waiting on replicaset/babel-history-76b97d9cdb (apps/v1) namespace: babel-system
2:43:46PM:  L ok: waiting on replicaset/babel-history-54657b5cdd (apps/v1) namespace: babel-system
2:43:46PM:  L ongoing: waiting on pod/babel-history-7c57b4cf49-qnd5h (v1) namespace: babel-system
2:43:46PM:     ^ Condition Ready is not True (False)
2:43:46PM:  L ok: waiting on pod/babel-history-76b97d9cdb-cqqfp (v1) namespace: babel-system
2:43:46PM: ongoing: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
2:43:46PM:  ^ Waiting for 1 unavailable replicas
2:43:46PM:  L ok: waiting on replicaset/babel-ai-proxy-c4bbf9b54 (apps/v1) namespace: babel-system
2:43:46PM:  L ok: waiting on replicaset/babel-ai-proxy-847ffd96f4 (apps/v1) namespace: babel-system
2:43:46PM:  L ok: waiting on replicaset/babel-ai-proxy-6fcc94545d (apps/v1) namespace: babel-system
2:43:46PM:  L ok: waiting on replicaset/babel-ai-proxy-6fc98f56f9 (apps/v1) namespace: babel-system
2:43:46PM:  L ok: waiting on replicaset/babel-ai-proxy-664879578b (apps/v1) namespace: babel-system
2:43:46PM:  L ok: waiting on replicaset/babel-ai-proxy-657cbdcdf9 (apps/v1) namespace: babel-system
2:43:46PM:  L ok: waiting on replicaset/babel-ai-proxy-64fd6dc7c8 (apps/v1) namespace: babel-system
2:43:46PM:  L ongoing: waiting on pod/babel-ai-proxy-847ffd96f4-czm8l (v1) namespace: babel-system
2:43:46PM:     ^ Condition Ready is not True (False)
2:43:46PM:  L ok: waiting on pod/babel-ai-proxy-64fd6dc7c8-s8mrv (v1) namespace: babel-system
2:43:46PM: ok: reconcile deployment/babel-entrypoint (apps/v1) namespace: babel-system
2:43:46PM: ongoing: reconcile deployment/babel-vectorstore (apps/v1) namespace: babel-system
2:43:46PM:  ^ Waiting for 1 unavailable replicas
2:43:46PM:  L ok: waiting on replicaset/babel-vectorstore-7f79466dd8 (apps/v1) namespace: babel-system
2:43:46PM:  L ok: waiting on replicaset/babel-vectorstore-7c466df6f6 (apps/v1) namespace: babel-system
2:43:46PM:  L ok: waiting on replicaset/babel-vectorstore-77d47585b4 (apps/v1) namespace: babel-system
2:43:46PM:  L ok: waiting on replicaset/babel-vectorstore-6fb88bf7f6 (apps/v1) namespace: babel-system
2:43:46PM:  L ok: waiting on replicaset/babel-vectorstore-55d96b7c7 (apps/v1) namespace: babel-system
2:43:46PM:  L ok: waiting on pod/babel-vectorstore-7c466df6f6-2wnsw (v1) namespace: babel-system
2:43:46PM:  L ongoing: waiting on pod/babel-vectorstore-55d96b7c7-7dfhx (v1) namespace: babel-system
2:43:46PM:     ^ Condition Ready is not True (False)
2:43:46PM: ongoing: reconcile deployment/babel-toolbox (apps/v1) namespace: babel-tenant
2:43:46PM:  ^ Waiting for 1 unavailable replicas
2:43:46PM:  L ok: waiting on replicaset/babel-toolbox-c4d579fb7 (apps/v1) namespace: babel-tenant
2:43:46PM:  L ok: waiting on replicaset/babel-toolbox-7dd79dc48b (apps/v1) namespace: babel-tenant
2:43:46PM:  L ok: waiting on replicaset/babel-toolbox-76fbb85c4b (apps/v1) namespace: babel-tenant
2:43:46PM:  L ok: waiting on replicaset/babel-toolbox-75559ffd6f (apps/v1) namespace: babel-tenant
2:43:46PM:  L ok: waiting on replicaset/babel-toolbox-649569bf96 (apps/v1) namespace: babel-tenant
2:43:46PM:  L ongoing: waiting on pod/babel-toolbox-c4d579fb7-czrnz (v1) namespace: babel-tenant
2:43:46PM:     ^ Condition Ready is not True (False)
2:43:46PM:  L ok: waiting on pod/babel-toolbox-76fbb85c4b-f5kxs (v1) namespace: babel-tenant
2:43:46PM: ---- waiting on 6 changes [3/12 done] ----
2:43:49PM: ok: reconcile deployment/babel-observ (apps/v1) namespace: babel-system
2:43:49PM: ---- waiting on 5 changes [4/12 done] ----
2:43:55PM: ok: reconcile deployment/babel-toolbox (apps/v1) namespace: babel-tenant
2:43:55PM: ok: reconcile deployment/babel-history (apps/v1) namespace: babel-system
2:43:55PM: ---- waiting on 3 changes [6/12 done] ----
2:44:04PM: ok: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
2:44:04PM: ok: reconcile deployment/babel-vectorstore (apps/v1) namespace: babel-system
2:44:04PM: ok: reconcile deployment/babel-storage (apps/v1) namespace: babel-system
2:44:04PM: ---- applying 1 changes [9/12 done] ----
2:44:06PM: update deployment/babel-agent (apps/v1) namespace: babel-system
2:44:06PM: ---- waiting on 1 changes [9/12 done] ----
2:44:06PM: ongoing: reconcile deployment/babel-agent (apps/v1) namespace: babel-system
2:44:06PM:  ^ Waiting for generation 43 to be observed
2:44:06PM:  L ok: waiting on replicaset/babel-agent-845dcc76db (apps/v1) namespace: babel-system
2:44:06PM:  L ok: waiting on replicaset/babel-agent-7ffb499c5b (apps/v1) namespace: babel-system
2:44:06PM:  L ok: waiting on replicaset/babel-agent-7cbdbbc696 (apps/v1) namespace: babel-system
2:44:06PM:  L ok: waiting on replicaset/babel-agent-79c4f5c598 (apps/v1) namespace: babel-system
2:44:06PM:  L ok: waiting on replicaset/babel-agent-75666c6f89 (apps/v1) namespace: babel-system
2:44:06PM:  L ok: waiting on replicaset/babel-agent-74dcf895f5 (apps/v1) namespace: babel-system
2:44:06PM:  L ok: waiting on replicaset/babel-agent-6f8b64c7fb (apps/v1) namespace: babel-system
2:44:06PM:  L ok: waiting on replicaset/babel-agent-5ddff6c776 (apps/v1) namespace: babel-system
2:44:06PM:  L ok: waiting on replicaset/babel-agent-5d58568545 (apps/v1) namespace: babel-system
2:44:06PM:  L ok: waiting on replicaset/babel-agent-5cccb887bc (apps/v1) namespace: babel-system
2:44:06PM:  L ok: waiting on replicaset/babel-agent-56dfb9dffc (apps/v1) namespace: babel-system
2:44:09PM: ok: reconcile deployment/babel-agent (apps/v1) namespace: babel-system
2:44:09PM: ---- applying 1 changes [10/12 done] ----
2:44:09PM: update deployment/babel-controller (apps/v1) namespace: babel-system
2:44:09PM: ---- waiting on 1 changes [10/12 done] ----
2:44:09PM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
2:44:09PM:  ^ Waiting for generation 45 to be observed
2:44:09PM:  L ok: waiting on replicaset/babel-controller-df4ff8846 (apps/v1) namespace: babel-system
2:44:09PM:  L ok: waiting on replicaset/babel-controller-cc449bbd4 (apps/v1) namespace: babel-system
2:44:09PM:  L ok: waiting on replicaset/babel-controller-84b594bb8 (apps/v1) namespace: babel-system
2:44:09PM:  L ok: waiting on replicaset/babel-controller-848968794 (apps/v1) namespace: babel-system
2:44:09PM:  L ok: waiting on replicaset/babel-controller-7f74845599 (apps/v1) namespace: babel-system
2:44:09PM:  L ok: waiting on replicaset/babel-controller-7c94559b9f (apps/v1) namespace: babel-system
2:44:09PM:  L ok: waiting on replicaset/babel-controller-7c7cf44587 (apps/v1) namespace: babel-system
2:44:09PM:  L ok: waiting on replicaset/babel-controller-74dd56977 (apps/v1) namespace: babel-system
2:44:09PM:  L ok: waiting on replicaset/babel-controller-747bfc57f6 (apps/v1) namespace: babel-system
2:44:09PM:  L ok: waiting on replicaset/babel-controller-6f4d79dbb6 (apps/v1) namespace: babel-system
2:44:09PM:  L ok: waiting on replicaset/babel-controller-6956b74f69 (apps/v1) namespace: babel-system
2:44:09PM:  L ok: waiting on replicaset/babel-controller-57689d8957 (apps/v1) namespace: babel-system
2:44:09PM:  L ok: waiting on pod/babel-controller-df4ff8846-7j942 (v1) namespace: babel-system
2:44:09PM:  L ongoing: waiting on pod/babel-controller-747bfc57f6-4bhzg (v1) namespace: babel-system
2:44:09PM:     ^ Pending
2:44:12PM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
2:44:12PM:  ^ Waiting for 1 unavailable replicas
2:44:12PM:  L ok: waiting on replicaset/babel-controller-df4ff8846 (apps/v1) namespace: babel-system
2:44:12PM:  L ok: waiting on replicaset/babel-controller-cc449bbd4 (apps/v1) namespace: babel-system
2:44:12PM:  L ok: waiting on replicaset/babel-controller-84b594bb8 (apps/v1) namespace: babel-system
2:44:12PM:  L ok: waiting on replicaset/babel-controller-848968794 (apps/v1) namespace: babel-system
2:44:12PM:  L ok: waiting on replicaset/babel-controller-7f74845599 (apps/v1) namespace: babel-system
2:44:12PM:  L ok: waiting on replicaset/babel-controller-7c94559b9f (apps/v1) namespace: babel-system
2:44:12PM:  L ok: waiting on replicaset/babel-controller-7c7cf44587 (apps/v1) namespace: babel-system
2:44:12PM:  L ok: waiting on replicaset/babel-controller-74dd56977 (apps/v1) namespace: babel-system
2:44:12PM:  L ok: waiting on replicaset/babel-controller-747bfc57f6 (apps/v1) namespace: babel-system
2:44:12PM:  L ok: waiting on replicaset/babel-controller-6f4d79dbb6 (apps/v1) namespace: babel-system
2:44:12PM:  L ok: waiting on replicaset/babel-controller-6956b74f69 (apps/v1) namespace: babel-system
2:44:12PM:  L ok: waiting on replicaset/babel-controller-57689d8957 (apps/v1) namespace: babel-system
2:44:12PM:  L ok: waiting on pod/babel-controller-df4ff8846-7j942 (v1) namespace: babel-system
2:44:12PM:  L ongoing: waiting on pod/babel-controller-747bfc57f6-4bhzg (v1) namespace: babel-system
2:44:12PM:     ^ Condition Ready is not True (False)
2:44:39PM: ok: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
2:44:39PM: ---- applying 1 changes [11/12 done] ----
2:44:39PM: update deployment/babel-frontend (apps/v1) namespace: babel-system
2:44:39PM: ---- waiting on 1 changes [11/12 done] ----
2:44:39PM: ongoing: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
2:44:39PM:  ^ Waiting for generation 32 to be observed
2:44:39PM:  L ok: waiting on replicaset/babel-frontend-fcb7c87dd (apps/v1) namespace: babel-system
2:44:39PM:  L ok: waiting on replicaset/babel-frontend-c9fcf49f5 (apps/v1) namespace: babel-system
2:44:39PM:  L ok: waiting on replicaset/babel-frontend-b68f7cf9b (apps/v1) namespace: babel-system
2:44:39PM:  L ok: waiting on replicaset/babel-frontend-7966f7457d (apps/v1) namespace: babel-system
2:44:39PM:  L ok: waiting on replicaset/babel-frontend-6b979c4648 (apps/v1) namespace: babel-system
2:44:39PM:  L ok: waiting on replicaset/babel-frontend-648545b56 (apps/v1) namespace: babel-system
2:44:39PM:  L ok: waiting on replicaset/babel-frontend-6446bdfffd (apps/v1) namespace: babel-system
2:44:39PM:  L ok: waiting on replicaset/babel-frontend-5ff48b84b4 (apps/v1) namespace: babel-system
2:44:39PM:  L ok: waiting on replicaset/babel-frontend-59cd84567d (apps/v1) namespace: babel-system
2:44:39PM:  L ok: waiting on replicaset/babel-frontend-5864b55844 (apps/v1) namespace: babel-system
2:44:39PM:  L ok: waiting on replicaset/babel-frontend-5844556999 (apps/v1) namespace: babel-system
2:44:39PM:  L ok: waiting on replicaset/babel-frontend-555cb8f5b6 (apps/v1) namespace: babel-system
2:44:39PM:  L ok: waiting on pod/babel-frontend-fcb7c87dd-hpkj8 (v1) namespace: babel-system
2:44:39PM:  L ongoing: waiting on pod/babel-frontend-5ff48b84b4-4v2st (v1) namespace: babel-system
2:44:39PM:     ^ Pending
2:44:42PM: ongoing: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
2:44:42PM:  ^ Waiting for 1 unavailable replicas
2:44:42PM:  L ok: waiting on replicaset/babel-frontend-fcb7c87dd (apps/v1) namespace: babel-system
2:44:42PM:  L ok: waiting on replicaset/babel-frontend-c9fcf49f5 (apps/v1) namespace: babel-system
2:44:42PM:  L ok: waiting on replicaset/babel-frontend-b68f7cf9b (apps/v1) namespace: babel-system
2:44:42PM:  L ok: waiting on replicaset/babel-frontend-7966f7457d (apps/v1) namespace: babel-system
2:44:42PM:  L ok: waiting on replicaset/babel-frontend-6b979c4648 (apps/v1) namespace: babel-system
2:44:42PM:  L ok: waiting on replicaset/babel-frontend-648545b56 (apps/v1) namespace: babel-system
2:44:42PM:  L ok: waiting on replicaset/babel-frontend-6446bdfffd (apps/v1) namespace: babel-system
2:44:42PM:  L ok: waiting on replicaset/babel-frontend-5ff48b84b4 (apps/v1) namespace: babel-system
2:44:42PM:  L ok: waiting on replicaset/babel-frontend-59cd84567d (apps/v1) namespace: babel-system
2:44:42PM:  L ok: waiting on replicaset/babel-frontend-5864b55844 (apps/v1) namespace: babel-system
2:44:42PM:  L ok: waiting on replicaset/babel-frontend-5844556999 (apps/v1) namespace: babel-system
2:44:42PM:  L ok: waiting on replicaset/babel-frontend-555cb8f5b6 (apps/v1) namespace: babel-system
2:44:42PM:  L ok: waiting on pod/babel-frontend-fcb7c87dd-hpkj8 (v1) namespace: babel-system
2:44:42PM:  L ongoing: waiting on pod/babel-frontend-5ff48b84b4-4v2st (v1) namespace: babel-system
2:44:42PM:     ^ Condition Ready is not True (False)
2:45:00PM: ok: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
2:45:00PM: ---- applying complete [12/12 done] ----
2:45:00PM: ---- waiting complete [12/12 done] ----

Succeeded
Deleted: ghcr.io/babelcloud/babel-ai-proxy:25fe4ad
Deleted: ghcr.io/babelcloud/babel-controller:4d983cc
 ➜ Setup port forwarding...
 ✔ Port forwarding completed, elapsed 0.700s
 ✔ Installed Babel App, elapsed 2m 47s

git pull
remote: Enumerating objects: 66, done.
remote: Counting objects: 100% (66/66), done.
remote: Compressing objects: 100% (37/37), done.
remote: Total 66 (delta 37), reused 50 (delta 29), pack-reused 0 (from 0)
Unpacking objects: 100% (66/66), 26.12 KiB | 922.00 KiB/s, done.
From github.com:babelcloud/babel-umbrella
   52a85c2..42d1b20  main                                   -> origin/main
 * [new branch]      revert-1049-lhm/babel                  -> origin/revert-1049-lhm/babel
 * [new branch]      vangie/set-public-read-ut-compare-path -> origin/vangie/set-public-read-ut-compare-path
Fetching submodule agent
From github.com:babelcloud/babel-agent
 * [new branch]      hui/fine-tuning -> origin/hui/fine-tuning
   f1eb49f..a8f22d5  main            -> origin/main
Fetching submodule ai-proxy
From github.com:babelcloud/babel-ai-proxy
   ac712ad..a9291e2  main                    -> origin/main
 * [new branch]      vangie/add-cors-support -> origin/vangie/add-cors-support
Fetching submodule frontend
From github.com:babelcloud/babel-frontend
   4764cec7..a3287544  main       -> origin/main
Fetching submodule test
From github.com:babelcloud/babel-test
   c853987..7e67c42  main       -> origin/main
Fetching submodule toolbox
From github.com:babelcloud/babel-toolbox
 * [new branch]      lhm/playwright -> origin/lhm/playwright
   eec6963..93826b7  lhm/test       -> origin/lhm/test
   d04b28d..e5f858b  main           -> origin/main
Updating 52a85c2..42d1b20
Fast-forward
 .github/workflows/app-deploy.yml         |  2 +-
 .github/workflows/env-deploy.yml         |  1 +
 agent                                    |  2 +-
 ai-proxy                                 |  2 +-
 deploy/commons/babel/agent.yaml          |  8 ++++++++
 deploy/commons/babel/entrypoint.yml      |  8 +++++++-
 deploy/commons/babel/recovery.yml        |  4 ++++
 deploy/commons/babel/runtime-webhook.yml |  4 ++++
 deploy/commons/babel/swe-bench-ecr.yaml  |  4 ++++
 deploy/commons/commons.sh                |  6 +++++-
 deploy/commons/ops/nginx.yml             | 13 +++++++++++++
 frontend                                 |  2 +-
 test                                     |  2 +-
 toolbox                                  |  2 +-
 14 files changed, 52 insertions(+), 8 deletions(-)
git submodule update
Submodule path 'agent': checked out 'a8f22d5a9cab85f5d98cf22498c88bdf540afa3e'
Submodule path 'ai-proxy': checked out 'a9291e27ea013f2b77657a954f2e0cf6a9c44dcb'
Submodule path 'frontend': checked out 'a32875449b85c0923a70a976f00fd0da2f0ed76a'
Submodule path 'test': checked out '7e67c42607597eecae6a175264206c1aeaca09f3'
Submodule path 'toolbox': checked out 'e5f858beedd5892d05e20d72749b84fe098d0050'
make install-app
Services run locally: agent

 ➜ Preload service images...
 ✔ Preload service images, elapsed 1m 15s
Target cluster 'https://0.0.0.0:40180' (nodes: babelcloud-control-plane)

@@ create configmap/babel-entrypoint-config-ver-5 (v1) namespace: babel-system @@
  ...
 57, 57         location /blog {
     58 +         rewrite ^(.+[^/])$ $http_x_forwarded_proto://$host:$http_x_forwarded_port$1/ permanent;
     59 +
 58, 60           proxy_set_header        Host                    babelcloud.github.io;
 59, 61           proxy_set_header        X-Host                  babelcloud.github.io;
  ...
 66, 68         location /admin {
     69 +         rewrite ^(.+[^/])$ $http_x_forwarded_proto://$host:$http_x_forwarded_port$1/ permanent;
     70 +
 67, 71           include proxy_params;
 68, 72
  ...
100,104         }
    105 +
    106 +       set $agent_upstream http://${AGENT}:${AGENT_PORT};
101,107
102,108         location / {
103,109           rewrite ^/(.*)$ /api/agent/assets/public/$1 break;
104     -         proxy_pass http://${AGENT}:${AGENT_PORT};
    110 +         proxy_pass $agent_upstream;
105,111
106,112           proxy_hide_header Access-Control-Allow-Origin;
@@ update deployment/babel-agent (apps/v1) namespace: babel-system @@
  ...
690,690                 name: babel-infra-secret
691     -         image: ghcr.io/babelcloud/babel-agent:f1eb49f
    691 +         image: ghcr.io/babelcloud/babel-agent:a8f22d5
692,692           imagePullPolicy: IfNotPresent
693,693           livenessProbe:
@@ update cronjob/babel-sandbox-cleaner (batch/v1) namespace: babel-system @@
  ...
 75, 75   spec:
     76 +   failedJobsHistoryLimit: 1
 76, 77     jobTemplate:
 77, 78       spec:
     79 +       backoffLimit: 0
 78, 80         template:
 79, 81           metadata:
  ...
 99,101             restartPolicy: Never
    102 +       ttlSecondsAfterFinished: 120
100,103     schedule: '*/5 * * * *'
    104 +   successfulJobsHistoryLimit: 1
101,105
@@ update cronjob/babel-orphaned-jobs-cleaner (batch/v1) namespace: babel-system @@
  ...
 74, 74   spec:
     75 +   failedJobsHistoryLimit: 1
 75, 76     jobTemplate:
 76, 77       spec:
     78 +       backoffLimit: 0
 77, 79         template:
 78, 80           metadata:
  ...
 98,100             restartPolicy: Never
    101 +       ttlSecondsAfterFinished: 120
 99,102     schedule: 0,30 * * * *
    103 +   successfulJobsHistoryLimit: 1
100,104
@@ update deployment/babel-ai-proxy (apps/v1) namespace: babel-system @@
  ...
318,318             value: ""
319     -         image: ghcr.io/babelcloud/babel-ai-proxy:ac712ad
    319 +         image: ghcr.io/babelcloud/babel-ai-proxy:a9291e2
320,320           imagePullPolicy: IfNotPresent
321,321           livenessProbe:
@@ update deployment/babel-controller (apps/v1) namespace: babel-system @@
  ...
535,535           - name: BABELCLOUD_REVISION
536     -           value: 52a85c21b0f51927978630fd8ce6170288592c04
    536 +           value: 42d1b20ff479eb012b33d5bb94a002bcae1a233d
537,537           - name: BABELCLOUD_ENVIRONMENT
538,538             valueFrom:
@@ update deployment/babel-entrypoint (apps/v1) namespace: babel-system @@
  ...
  9,  9         kind: ConfigMap
 10     -       name: babel-entrypoint-config-ver-4
     10 +       name: babel-entrypoint-config-ver-5
 11, 11     creationTimestamp: "2024-07-20T15:48:28Z"
 12, 12     generation: 8
  ...
296,296         - configMap:
297     -           name: babel-entrypoint-config-ver-4
    297 +           name: babel-entrypoint-config-ver-5
298,298           name: babel-entrypoint-config
299,299
@@ update deployment/babel-frontend (apps/v1) namespace: babel-system @@
  ...
166,166                 name: babel-infra-config
167     -         image: ghcr.io/babelcloud/babel-frontend:4764cec
    167 +         image: ghcr.io/babelcloud/babel-frontend:a328754
168,168           imagePullPolicy: IfNotPresent
169,169           livenessProbe:
@@ update cronjob/babel-backup (batch/v1) namespace: babel-system @@
  ...
133,133   spec:
    134 +   failedJobsHistoryLimit: 1
134,135     jobTemplate:
135,136       spec:
    137 +       backoffLimit: 1
136,138         template:
137,139           metadata:
  ...
198,200             restartPolicy: OnFailure
    201 +       ttlSecondsAfterFinished: 120
199,202     schedule: 0 16 * * *
    203 +   successfulJobsHistoryLimit: 1
200,204     suspend: true
201,205
@@ update cronjob/babel-runtime-token-refresh-trigger (batch/v1) namespace: babel-system @@
  ...
 74, 74   spec:
     75 +   failedJobsHistoryLimit: 1
 75, 76     jobTemplate:
 76, 77       spec:
     78 +       backoffLimit: 1
 77, 79         template:
 78, 80           metadata:
  ...
 95, 97             restartPolicy: Never
     98 +       ttlSecondsAfterFinished: 120
 96, 99     schedule: '*/1 * * * *'
    100 +   successfulJobsHistoryLimit: 1
 97,101
@@ update cronjob/swe-bench-ecr (batch/v1) namespace: babel-system @@
  ...
 88, 88   spec:
     89 +   failedJobsHistoryLimit: 1
 89, 90     jobTemplate:
 90, 91       spec:
     92 +       backoffLimit: 1
 91, 93         template:
 92, 94           metadata:
  ...
116,118             serviceAccountName: swe-bench-ecr
    119 +       ttlSecondsAfterFinished: 120
117,120     schedule: '*/1 * * * *'
    121 +   successfulJobsHistoryLimit: 1
118,122
@@ update deployment/babel-toolbox (apps/v1) namespace: babel-tenant @@
  ...
190,190           - name: KUBERNETES_PORT_443_TCP_PORT
191     -         image: ghcr.io/babelcloud/babel-toolbox:d04b28d
    191 +         image: ghcr.io/babelcloud/babel-toolbox:e5f858b
192,192           imagePullPolicy: IfNotPresent
193,193           livenessProbe:

Changes

Namespace     Name                                 Kind        Age  Op      Op st.  Wait to    Rs  Ri
babel-system  babel-agent                          Deployment  43d  update  -       reconcile  ok  -
^             babel-ai-proxy                       Deployment  43d  update  -       reconcile  ok  -
^             babel-backup                         CronJob     43d  update  -       reconcile  ok  -
^             babel-controller                     Deployment  43d  update  -       reconcile  ok  -
^             babel-entrypoint                     Deployment  43d  update  -       reconcile  ok  -
^             babel-entrypoint-config-ver-5        ConfigMap   -    create  -       reconcile  -   -
^             babel-frontend                       Deployment  43d  update  -       reconcile  ok  -
^             babel-orphaned-jobs-cleaner          CronJob     43d  update  -       reconcile  ok  -
^             babel-runtime-token-refresh-trigger  CronJob     43d  update  -       reconcile  ok  -
^             babel-sandbox-cleaner                CronJob     43d  update  -       reconcile  ok  -
^             swe-bench-ecr                        CronJob     43d  update  -       reconcile  ok  -
babel-tenant  babel-toolbox                        Deployment  43d  update  -       reconcile  ok  -

Op:      1 create, 0 delete, 11 update, 0 noop, 0 exists
Wait to: 12 reconcile, 0 delete, 0 noop

5:52:44PM: ---- applying 1 changes [0/12 done] ----
5:52:44PM: create configmap/babel-entrypoint-config-ver-5 (v1) namespace: babel-system
5:52:44PM: ---- waiting on 1 changes [0/12 done] ----
5:52:44PM: ok: reconcile configmap/babel-entrypoint-config-ver-5 (v1) namespace: babel-system
5:52:44PM: ---- applying 6 changes [1/12 done] ----
5:52:44PM: update cronjob/babel-runtime-token-refresh-trigger (batch/v1) namespace: babel-system
5:52:44PM: update deployment/babel-entrypoint (apps/v1) namespace: babel-system
5:52:44PM: update cronjob/babel-backup (batch/v1) namespace: babel-system
5:52:44PM: update deployment/babel-ai-proxy (apps/v1) namespace: babel-system
5:52:44PM: update cronjob/swe-bench-ecr (batch/v1) namespace: babel-system
5:52:44PM: update deployment/babel-toolbox (apps/v1) namespace: babel-tenant
5:52:44PM: ---- waiting on 6 changes [1/12 done] ----
5:52:44PM: ok: reconcile cronjob/babel-runtime-token-refresh-trigger (batch/v1) namespace: babel-system
5:52:44PM: ok: reconcile cronjob/babel-backup (batch/v1) namespace: babel-system
5:52:44PM: ok: reconcile cronjob/swe-bench-ecr (batch/v1) namespace: babel-system
5:52:44PM: ongoing: reconcile deployment/babel-toolbox (apps/v1) namespace: babel-tenant
5:52:44PM:  ^ Waiting for generation 14 to be observed
5:52:44PM:  L ok: waiting on replicaset/babel-toolbox-c4d579fb7 (apps/v1) namespace: babel-tenant
5:52:44PM:  L ok: waiting on replicaset/babel-toolbox-9b4996d89 (apps/v1) namespace: babel-tenant
5:52:44PM:  L ok: waiting on replicaset/babel-toolbox-7dd79dc48b (apps/v1) namespace: babel-tenant
5:52:44PM:  L ok: waiting on replicaset/babel-toolbox-76fbb85c4b (apps/v1) namespace: babel-tenant
5:52:44PM:  L ok: waiting on replicaset/babel-toolbox-75559ffd6f (apps/v1) namespace: babel-tenant
5:52:44PM:  L ok: waiting on replicaset/babel-toolbox-7469fbdfc4 (apps/v1) namespace: babel-tenant
5:52:44PM:  L ok: waiting on replicaset/babel-toolbox-649569bf96 (apps/v1) namespace: babel-tenant
5:52:44PM:  L ok: waiting on pod/babel-toolbox-9b4996d89-5rqz4 (v1) namespace: babel-tenant
5:52:44PM: ongoing: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
5:52:44PM:  ^ Waiting for generation 15 to be observed
5:52:44PM:  L ok: waiting on replicaset/babel-ai-proxy-f4fb44f78 (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-ai-proxy-cdbf94b64 (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-ai-proxy-c4bbf9b54 (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-ai-proxy-847ffd96f4 (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-ai-proxy-6fcc94545d (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-ai-proxy-6fc98f56f9 (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-ai-proxy-664879578b (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-ai-proxy-657cbdcdf9 (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-ai-proxy-64fd6dc7c8 (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on pod/babel-ai-proxy-cdbf94b64-fhhww (v1) namespace: babel-system
5:52:44PM: ongoing: reconcile deployment/babel-entrypoint (apps/v1) namespace: babel-system
5:52:44PM:  ^ Waiting for generation 10 to be observed
5:52:44PM:  L ok: waiting on replicaset/babel-entrypoint-fc87b9c85 (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-entrypoint-df6ff574c (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-entrypoint-b945d86b6 (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-entrypoint-676744787b (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-entrypoint-6488fbb7dd (apps/v1) namespace: babel-system
5:52:44PM:  L ongoing: waiting on pod/babel-entrypoint-fc87b9c85-jcwnb (v1) namespace: babel-system
5:52:44PM:     ^ Pending
5:52:44PM:  L ok: waiting on pod/babel-entrypoint-b945d86b6-jjhl2 (v1) namespace: babel-system
5:52:44PM: ---- waiting on 3 changes [4/12 done] ----
5:52:44PM: ongoing: reconcile deployment/babel-toolbox (apps/v1) namespace: babel-tenant
5:52:44PM:  ^ Waiting for generation 14 to be observed
5:52:44PM:  L ok: waiting on replicaset/babel-toolbox-c4d579fb7 (apps/v1) namespace: babel-tenant
5:52:44PM:  L ok: waiting on replicaset/babel-toolbox-9b4996d89 (apps/v1) namespace: babel-tenant
5:52:44PM:  L ok: waiting on replicaset/babel-toolbox-7dd79dc48b (apps/v1) namespace: babel-tenant
5:52:44PM:  L ok: waiting on replicaset/babel-toolbox-76fbb85c4b (apps/v1) namespace: babel-tenant
5:52:44PM:  L ok: waiting on replicaset/babel-toolbox-75559ffd6f (apps/v1) namespace: babel-tenant
5:52:44PM:  L ok: waiting on replicaset/babel-toolbox-7469fbdfc4 (apps/v1) namespace: babel-tenant
5:52:44PM:  L ok: waiting on replicaset/babel-toolbox-649569bf96 (apps/v1) namespace: babel-tenant
5:52:44PM:  L ok: waiting on pod/babel-toolbox-9b4996d89-5rqz4 (v1) namespace: babel-tenant
5:52:44PM:  L ongoing: waiting on pod/babel-toolbox-7469fbdfc4-z9wf7 (v1) namespace: babel-tenant
5:52:44PM:     ^ Pending
5:52:44PM: ongoing: reconcile deployment/babel-entrypoint (apps/v1) namespace: babel-system
5:52:44PM:  ^ Waiting for generation 10 to be observed
5:52:44PM:  L ok: waiting on replicaset/babel-entrypoint-fc87b9c85 (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-entrypoint-df6ff574c (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-entrypoint-b945d86b6 (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-entrypoint-676744787b (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-entrypoint-6488fbb7dd (apps/v1) namespace: babel-system
5:52:44PM:  L ongoing: waiting on pod/babel-entrypoint-fc87b9c85-jcwnb (v1) namespace: babel-system
5:52:44PM:     ^ Pending: ContainerCreating
5:52:44PM:  L ok: waiting on pod/babel-entrypoint-b945d86b6-jjhl2 (v1) namespace: babel-system
5:52:44PM: ongoing: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
5:52:44PM:  ^ Waiting for generation 15 to be observed
5:52:44PM:  L ok: waiting on replicaset/babel-ai-proxy-f4fb44f78 (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-ai-proxy-cdbf94b64 (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-ai-proxy-c4bbf9b54 (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-ai-proxy-847ffd96f4 (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-ai-proxy-6fcc94545d (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-ai-proxy-6fc98f56f9 (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-ai-proxy-664879578b (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-ai-proxy-657cbdcdf9 (apps/v1) namespace: babel-system
5:52:44PM:  L ok: waiting on replicaset/babel-ai-proxy-64fd6dc7c8 (apps/v1) namespace: babel-system
5:52:44PM:  L ongoing: waiting on pod/babel-ai-proxy-f4fb44f78-hmrvc (v1) namespace: babel-system
5:52:44PM:     ^ Pending
5:52:44PM:  L ok: waiting on pod/babel-ai-proxy-cdbf94b64-fhhww (v1) namespace: babel-system
5:52:47PM: ok: reconcile deployment/babel-entrypoint (apps/v1) namespace: babel-system
5:52:47PM: ongoing: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
5:52:47PM:  ^ Waiting for 1 unavailable replicas
5:52:47PM:  L ok: waiting on replicaset/babel-ai-proxy-f4fb44f78 (apps/v1) namespace: babel-system
5:52:47PM:  L ok: waiting on replicaset/babel-ai-proxy-cdbf94b64 (apps/v1) namespace: babel-system
5:52:47PM:  L ok: waiting on replicaset/babel-ai-proxy-c4bbf9b54 (apps/v1) namespace: babel-system
5:52:47PM:  L ok: waiting on replicaset/babel-ai-proxy-847ffd96f4 (apps/v1) namespace: babel-system
5:52:47PM:  L ok: waiting on replicaset/babel-ai-proxy-6fcc94545d (apps/v1) namespace: babel-system
5:52:47PM:  L ok: waiting on replicaset/babel-ai-proxy-6fc98f56f9 (apps/v1) namespace: babel-system
5:52:47PM:  L ok: waiting on replicaset/babel-ai-proxy-664879578b (apps/v1) namespace: babel-system
5:52:47PM:  L ok: waiting on replicaset/babel-ai-proxy-657cbdcdf9 (apps/v1) namespace: babel-system
5:52:47PM:  L ok: waiting on replicaset/babel-ai-proxy-64fd6dc7c8 (apps/v1) namespace: babel-system
5:52:47PM:  L ongoing: waiting on pod/babel-ai-proxy-f4fb44f78-hmrvc (v1) namespace: babel-system
5:52:47PM:     ^ Condition Ready is not True (False)
5:52:47PM:  L ok: waiting on pod/babel-ai-proxy-cdbf94b64-fhhww (v1) namespace: babel-system
5:52:47PM: ongoing: reconcile deployment/babel-toolbox (apps/v1) namespace: babel-tenant
5:52:47PM:  ^ Waiting for 1 unavailable replicas
5:52:47PM:  L ok: waiting on replicaset/babel-toolbox-c4d579fb7 (apps/v1) namespace: babel-tenant
5:52:47PM:  L ok: waiting on replicaset/babel-toolbox-9b4996d89 (apps/v1) namespace: babel-tenant
5:52:47PM:  L ok: waiting on replicaset/babel-toolbox-7dd79dc48b (apps/v1) namespace: babel-tenant
5:52:47PM:  L ok: waiting on replicaset/babel-toolbox-76fbb85c4b (apps/v1) namespace: babel-tenant
5:52:47PM:  L ok: waiting on replicaset/babel-toolbox-75559ffd6f (apps/v1) namespace: babel-tenant
5:52:47PM:  L ok: waiting on replicaset/babel-toolbox-7469fbdfc4 (apps/v1) namespace: babel-tenant
5:52:47PM:  L ok: waiting on replicaset/babel-toolbox-649569bf96 (apps/v1) namespace: babel-tenant
5:52:47PM:  L ok: waiting on pod/babel-toolbox-9b4996d89-5rqz4 (v1) namespace: babel-tenant
5:52:47PM:  L ongoing: waiting on pod/babel-toolbox-7469fbdfc4-z9wf7 (v1) namespace: babel-tenant
5:52:47PM:     ^ Condition Ready is not True (False)
5:52:47PM: ---- waiting on 2 changes [5/12 done] ----
5:52:56PM: ok: reconcile deployment/babel-toolbox (apps/v1) namespace: babel-tenant
5:52:56PM: ok: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
5:52:56PM: ---- applying 1 changes [7/12 done] ----
5:52:57PM: update deployment/babel-agent (apps/v1) namespace: babel-system
5:52:57PM: ---- waiting on 1 changes [7/12 done] ----
5:52:57PM: ongoing: reconcile deployment/babel-agent (apps/v1) namespace: babel-system
5:52:57PM:  ^ Waiting for generation 47 to be observed
5:52:57PM:  L ok: waiting on replicaset/babel-agent-845dcc76db (apps/v1) namespace: babel-system
5:52:57PM:  L ok: waiting on replicaset/babel-agent-7cbdbbc696 (apps/v1) namespace: babel-system
5:52:57PM:  L ok: waiting on replicaset/babel-agent-79c4f5c598 (apps/v1) namespace: babel-system
5:52:57PM:  L ok: waiting on replicaset/babel-agent-75666c6f89 (apps/v1) namespace: babel-system
5:52:57PM:  L ok: waiting on replicaset/babel-agent-74dcf895f5 (apps/v1) namespace: babel-system
5:52:57PM:  L ok: waiting on replicaset/babel-agent-6f8b64c7fb (apps/v1) namespace: babel-system
5:52:57PM:  L ok: waiting on replicaset/babel-agent-6c5bb948dc (apps/v1) namespace: babel-system
5:52:57PM:  L ok: waiting on replicaset/babel-agent-64fb48c56 (apps/v1) namespace: babel-system
5:52:57PM:  L ok: waiting on replicaset/babel-agent-5ddff6c776 (apps/v1) namespace: babel-system
5:52:57PM:  L ok: waiting on replicaset/babel-agent-5cccb887bc (apps/v1) namespace: babel-system
5:52:57PM:  L ok: waiting on replicaset/babel-agent-56dfb9dffc (apps/v1) namespace: babel-system
5:53:00PM: ok: reconcile deployment/babel-agent (apps/v1) namespace: babel-system
5:53:00PM: ---- applying 3 changes [8/12 done] ----
5:53:00PM: update cronjob/babel-orphaned-jobs-cleaner (batch/v1) namespace: babel-system
5:53:00PM: update cronjob/babel-sandbox-cleaner (batch/v1) namespace: babel-system
5:53:00PM: update deployment/babel-controller (apps/v1) namespace: babel-system
5:53:00PM: ---- waiting on 3 changes [8/12 done] ----
5:53:00PM: ok: reconcile cronjob/babel-orphaned-jobs-cleaner (batch/v1) namespace: babel-system
5:53:00PM: ok: reconcile cronjob/babel-sandbox-cleaner (batch/v1) namespace: babel-system
5:53:00PM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
5:53:00PM:  ^ Waiting for generation 49 to be observed
5:53:00PM:  L ok: waiting on replicaset/babel-controller-df4ff8846 (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-cc449bbd4 (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-8565b956f7 (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-84b594bb8 (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-848968794 (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-7f74845599 (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-7c94559b9f (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-74dd56977 (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-747bfc57f6 (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-6f4d79dbb6 (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-5dd8f4596c (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-57689d8957 (apps/v1) namespace: babel-system
5:53:00PM:  L ongoing: waiting on pod/babel-controller-8565b956f7-dkdpt (v1) namespace: babel-system
5:53:00PM:     ^ Pending
5:53:00PM:  L ok: waiting on pod/babel-controller-5dd8f4596c-4xnjb (v1) namespace: babel-system
5:53:00PM: ---- waiting on 1 changes [10/12 done] ----
5:53:00PM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
5:53:00PM:  ^ Waiting for generation 49 to be observed
5:53:00PM:  L ok: waiting on replicaset/babel-controller-df4ff8846 (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-cc449bbd4 (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-8565b956f7 (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-84b594bb8 (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-848968794 (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-7f74845599 (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-7c94559b9f (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-74dd56977 (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-747bfc57f6 (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-6f4d79dbb6 (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-5dd8f4596c (apps/v1) namespace: babel-system
5:53:00PM:  L ok: waiting on replicaset/babel-controller-57689d8957 (apps/v1) namespace: babel-system
5:53:00PM:  L ongoing: waiting on pod/babel-controller-8565b956f7-dkdpt (v1) namespace: babel-system
5:53:00PM:     ^ Pending: PodInitializing
5:53:00PM:  L ok: waiting on pod/babel-controller-5dd8f4596c-4xnjb (v1) namespace: babel-system
5:53:03PM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
5:53:03PM:  ^ Waiting for 1 unavailable replicas
5:53:03PM:  L ok: waiting on replicaset/babel-controller-df4ff8846 (apps/v1) namespace: babel-system
5:53:03PM:  L ok: waiting on replicaset/babel-controller-cc449bbd4 (apps/v1) namespace: babel-system
5:53:03PM:  L ok: waiting on replicaset/babel-controller-8565b956f7 (apps/v1) namespace: babel-system
5:53:03PM:  L ok: waiting on replicaset/babel-controller-84b594bb8 (apps/v1) namespace: babel-system
5:53:03PM:  L ok: waiting on replicaset/babel-controller-848968794 (apps/v1) namespace: babel-system
5:53:03PM:  L ok: waiting on replicaset/babel-controller-7f74845599 (apps/v1) namespace: babel-system
5:53:03PM:  L ok: waiting on replicaset/babel-controller-7c94559b9f (apps/v1) namespace: babel-system
5:53:03PM:  L ok: waiting on replicaset/babel-controller-74dd56977 (apps/v1) namespace: babel-system
5:53:03PM:  L ok: waiting on replicaset/babel-controller-747bfc57f6 (apps/v1) namespace: babel-system
5:53:03PM:  L ok: waiting on replicaset/babel-controller-6f4d79dbb6 (apps/v1) namespace: babel-system
5:53:03PM:  L ok: waiting on replicaset/babel-controller-5dd8f4596c (apps/v1) namespace: babel-system
5:53:03PM:  L ok: waiting on replicaset/babel-controller-57689d8957 (apps/v1) namespace: babel-system
5:53:03PM:  L ongoing: waiting on pod/babel-controller-8565b956f7-dkdpt (v1) namespace: babel-system
5:53:03PM:     ^ Condition Ready is not True (False)
5:53:03PM:  L ok: waiting on pod/babel-controller-5dd8f4596c-4xnjb (v1) namespace: babel-system
5:53:30PM: ok: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
5:53:30PM: ---- applying 1 changes [11/12 done] ----
5:53:30PM: update deployment/babel-frontend (apps/v1) namespace: babel-system
5:53:30PM: ---- waiting on 1 changes [11/12 done] ----
5:53:30PM: ongoing: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
5:53:30PM:  ^ Waiting for generation 36 to be observed
5:53:30PM:  L ok: waiting on replicaset/babel-frontend-fcb7c87dd (apps/v1) namespace: babel-system
5:53:30PM:  L ok: waiting on replicaset/babel-frontend-c9fcf49f5 (apps/v1) namespace: babel-system
5:53:30PM:  L ok: waiting on replicaset/babel-frontend-b68f7cf9b (apps/v1) namespace: babel-system
5:53:30PM:  L ok: waiting on replicaset/babel-frontend-6b979c4648 (apps/v1) namespace: babel-system
5:53:30PM:  L ok: waiting on replicaset/babel-frontend-648545b56 (apps/v1) namespace: babel-system
5:53:30PM:  L ok: waiting on replicaset/babel-frontend-6446bdfffd (apps/v1) namespace: babel-system
5:53:30PM:  L ok: waiting on replicaset/babel-frontend-5ff48b84b4 (apps/v1) namespace: babel-system
5:53:30PM:  L ok: waiting on replicaset/babel-frontend-5cc79b84d7 (apps/v1) namespace: babel-system
5:53:30PM:  L ok: waiting on replicaset/babel-frontend-59cd84567d (apps/v1) namespace: babel-system
5:53:30PM:  L ok: waiting on replicaset/babel-frontend-59485bc9d9 (apps/v1) namespace: babel-system
5:53:30PM:  L ok: waiting on replicaset/babel-frontend-5864b55844 (apps/v1) namespace: babel-system
5:53:30PM:  L ok: waiting on replicaset/babel-frontend-555cb8f5b6 (apps/v1) namespace: babel-system
5:53:30PM:  L ok: waiting on pod/babel-frontend-5cc79b84d7-k5mpp (v1) namespace: babel-system
5:53:30PM:  L ongoing: waiting on pod/babel-frontend-59485bc9d9-nccq9 (v1) namespace: babel-system
5:53:30PM:     ^ Pending
5:53:33PM: ongoing: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
5:53:33PM:  ^ Waiting for 1 unavailable replicas
5:53:33PM:  L ok: waiting on replicaset/babel-frontend-fcb7c87dd (apps/v1) namespace: babel-system
5:53:33PM:  L ok: waiting on replicaset/babel-frontend-c9fcf49f5 (apps/v1) namespace: babel-system
5:53:33PM:  L ok: waiting on replicaset/babel-frontend-b68f7cf9b (apps/v1) namespace: babel-system
5:53:33PM:  L ok: waiting on replicaset/babel-frontend-6b979c4648 (apps/v1) namespace: babel-system
5:53:33PM:  L ok: waiting on replicaset/babel-frontend-648545b56 (apps/v1) namespace: babel-system
5:53:33PM:  L ok: waiting on replicaset/babel-frontend-6446bdfffd (apps/v1) namespace: babel-system
5:53:33PM:  L ok: waiting on replicaset/babel-frontend-5ff48b84b4 (apps/v1) namespace: babel-system
5:53:33PM:  L ok: waiting on replicaset/babel-frontend-5cc79b84d7 (apps/v1) namespace: babel-system
5:53:33PM:  L ok: waiting on replicaset/babel-frontend-59cd84567d (apps/v1) namespace: babel-system
5:53:33PM:  L ok: waiting on replicaset/babel-frontend-59485bc9d9 (apps/v1) namespace: babel-system
5:53:33PM:  L ok: waiting on replicaset/babel-frontend-5864b55844 (apps/v1) namespace: babel-system
5:53:33PM:  L ok: waiting on replicaset/babel-frontend-555cb8f5b6 (apps/v1) namespace: babel-system
5:53:33PM:  L ok: waiting on pod/babel-frontend-5cc79b84d7-k5mpp (v1) namespace: babel-system
5:53:33PM:  L ongoing: waiting on pod/babel-frontend-59485bc9d9-nccq9 (v1) namespace: babel-system
5:53:33PM:     ^ Condition Ready is not True (False)
5:53:42PM: ok: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
5:53:42PM: ---- applying complete [12/12 done] ----
5:53:42PM: ---- waiting complete [12/12 done] ----

Succeeded
Deleted: ghcr.io/babelcloud/babel-ai-proxy:ac712ad
Deleted: ghcr.io/babelcloud/babel-controller:1bc6250
 ➜ Setup port forwarding...
 ✔ Port forwarding completed, elapsed 0.370s
 ✔ Installed Babel App, elapsed 2m 20s
git pull
remote: Enumerating objects: 159, done.
remote: Counting objects: 100% (159/159), done.
remote: Compressing objects: 100% (74/74), done.
remote: Total 159 (delta 90), reused 145 (delta 79), pack-reused 0 (from 0)
Receiving objects: 100% (159/159), 136.77 KiB | 1.31 MiB/s, done.
Resolving deltas: 100% (90/90), completed with 17 local objects.
From github.com:babelcloud/babel-umbrella
   42d1b20..3b34baf  main                                      -> origin/main
 * [new branch]      hotfix-20240909                           -> origin/hotfix-20240909
 * [new branch]      vangie/integrate-openobserve-to-local-env -> origin/vangie/integrate-openobserve-to-local-env
 * [new tag]         hotfix-2024.09.09-2                       -> hotfix-2024.09.09-2
 * [new tag]         hotfix-2024.09.09-1                       -> hotfix-2024.09.09-1
 * [new tag]         prod-2024.09.09-1                         -> prod-2024.09.09-1
 * [new tag]         prod-2024.09.11-1                         -> prod-2024.09.11-1
Fetching submodule agent
From github.com:babelcloud/babel-agent
 * [new branch]      cxz/feat/vitester-decide -> origin/cxz/feat/vitester-decide
 * [new branch]      jiong/enhance-vitester-agent -> origin/jiong/enhance-vitester-agent
 * [new branch]      jiong/vitester-support -> origin/jiong/vitester-support
   a8f22d5..6ef9a43  main                   -> origin/main
Fetching submodule ai-proxy
From github.com:babelcloud/babel-ai-proxy
   a9291e2..df356c1  main       -> origin/main
 * [new branch]      mingshun/fix/openai-chat-completion-stream -> origin/mingshun/fix/openai-chat-completion-stream
 * [new branch]      vangie/add-support-for-gpt-4o-mini -> origin/vangie/add-support-for-gpt-4o-mini
 * [new branch]      vangie/update-default-gpt-4o -> origin/vangie/update-default-gpt-4o
Fetching submodule controller
From github.com:babelcloud/babel-controller
   67fc3d7..4105250  main       -> origin/main
Fetching submodule frontend
From github.com:babelcloud/babel-frontend
   a3287544..b4398093  main       -> origin/main
Fetching submodule test
From github.com:babelcloud/babel-test
   7e67c42..3c0d1c9  main       -> origin/main
Fetching submodule toolbox
From github.com:babelcloud/babel-toolbox
 * [new branch]      jiong/extract-diff-to-commit -> origin/jiong/extract-diff-to-commit
 * [new branch]      lhm/image  -> origin/lhm/image
   e5f858b..f03e8d9  main       -> origin/main
Updating 42d1b20..3b34baf
Fast-forward
 .gitmodules                                                          |   3 +++
 agent                                                                |   2 +-
 ai-proxy                                                             |   2 +-
 controller                                                           |   2 +-
 deploy/ai-key.sh                                                     | 132 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 deploy/commons/babel/controller.yml                                  |  40 +++++++++++++++++++++++++++++++++++++++-
 deploy/commons/babel/entrypoint.yml                                  |  21 +++++++++++++++++++++
 deploy/commons/babel/gru-home.yml                                    |  56 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 deploy/commons/babel/values.yml                                      |  10 +++++++++-
 deploy/commons/commons.sh                                            |   6 ++++++
 deploy/commons/scripts/deploy/install-app.sh                         |   8 ++++++--
 deploy/init/openai/azure-founders-hub/input.tf                       |  10 +++++-----
 deploy/init/openai/azure-founders-hub/modules/openai-service/main.tf |  27 +++++++++++++++++++++++----
 deploy/init/openai/azure/input.tf                                    |   5 ++---
 deploy/init/openai/modules/openai-service/main.tf                    |  27 ++++++++++++++++++++++-----
 deploy/init/resource/evaluation.tf                                   |  29 +++++++++++++++++++++++++++--
 deploy/local/scripts/install-app.sh                                  |   9 +++++++--
 deploy/local/scripts/port-forwarding/babel.conf                      |  12 ++++++++++++
 deploy/secret.sh                                                     |   4 ++++
 frontend                                                             |   2 +-
 gru-home                                                             |   1 +
 test                                                                 |   2 +-
 toolbox                                                              |   2 +-
 23 files changed, 381 insertions(+), 31 deletions(-)
 create mode 100755 deploy/ai-key.sh
 create mode 100644 deploy/commons/babel/gru-home.yml
 create mode 160000 gru-home
git submodule update
Submodule path 'agent': checked out '6ef9a43846299347b2705680bbf28eaaf8cc2837'
Submodule path 'ai-proxy': checked out 'df356c12d08220b33ee161dbe574e36064304b70'
Submodule path 'controller': checked out '4105250d9005e82b6db733edc0f1cf5e58661d12'
Submodule path 'frontend': checked out 'b4398093bd989482c7386bf07908124b52cfd3ad'
Submodule path 'test': checked out '3c0d1c9f9b8e9cd89b8cf3075d0afffb852ec2e5'
Submodule path 'toolbox': checked out 'f03e8d9c060f62f61af7f385d6a5d54e687a59f2'
make install-app
Services run locally: agent

 ✔ Preload service images, elapsed 5m 5s
Target cluster 'https://0.0.0.0:40180' (nodes: babelcloud-control-plane)

@@ create configmap/babel-entrypoint-config-ver-6 (v1) namespace: babel-system @@
  ...
 53, 53
     54 +       set $home_upstream http://${GRU_HOME}:${GRU_HOME_PORT};
 54, 55         set $frontend_upstream http://${FRONTEND}:${FRONTEND_PORT};
 55, 56         set $admin_upstream http://${ADMIN}:${ADMIN_PORT};
  ...
 73, 74           proxy_pass $admin_upstream;
     75 +       }
     76 +
     77 +       location /home {
     78 +         include proxy_params;
     79 +
     80 +         proxy_pass $home_upstream;
     81 +       }
     82 +
     83 +       location =/ {
     84 +         include proxy_params;
     85 +
     86 +         if ($http_cookie ~* "SESSION=") {
     87 +           return 307 $http_x_forwarded_proto://$host:$http_x_forwarded_port/new;
     88 +         }
     89 +
     90 +         proxy_pass $home_upstream;
 74, 91         }
 75, 92
@@ update deployment/babel-agent (apps/v1) namespace: babel-system @@
  ...
690,690                 name: babel-infra-secret
691     -         image: ghcr.io/babelcloud/babel-agent:a8f22d5
    691 +         image: ghcr.io/babelcloud/babel-agent:6ef9a43
692,692           imagePullPolicy: IfNotPresent
693,693           livenessProbe:
@@ update deployment/babel-ai-proxy (apps/v1) namespace: babel-system @@
  ...
318,318             value: ""
319     -         image: ghcr.io/babelcloud/babel-ai-proxy:a9291e2
    319 +         image: ghcr.io/babelcloud/babel-ai-proxy:df356c1
320,320           imagePullPolicy: IfNotPresent
321,321           livenessProbe:
@@ update deployment/babel-controller (apps/v1) namespace: babel-system @@
  ...
535,535           - name: BABELCLOUD_REVISION
536     -           value: 42d1b20ff479eb012b33d5bb94a002bcae1a233d
    536 +           value: 3b34baf79fc6f5741b3cf85888d1baf44a212cbc
537,537           - name: BABELCLOUD_ENVIRONMENT
538,538             valueFrom:
  ...
782,782             value: "false"
783     -         image: ghcr.io/babelcloud/babel-controller:67fc3d7
    783 +         image: ghcr.io/babelcloud/babel-controller:4105250
784,784           imagePullPolicy: IfNotPresent
785,785           livenessProbe:
@@ update deployment/babel-entrypoint (apps/v1) namespace: babel-system @@
  ...
  9,  9         kind: ConfigMap
 10     -       name: babel-entrypoint-config-ver-5
     10 +       name: babel-entrypoint-config-ver-6
 11, 11     creationTimestamp: "2024-07-20T15:48:28Z"
 12, 12     generation: 10
  ...
253,253             value: "8083"
    254 +         - name: GRU_HOME
    255 +           value: gru-home.babel-system.svc.cluster.local
    256 +         - name: GRU_HOME_PORT
    257 +           value: "3011"
254,258           - name: RUNTIME_DOMAIN
255,259             value: 127-0-0-1.sslip.io
  ...
296,300         - configMap:
297     -           name: babel-entrypoint-config-ver-5
    301 +           name: babel-entrypoint-config-ver-6
298,302           name: babel-entrypoint-config
299,303
@@ update deployment/babel-frontend (apps/v1) namespace: babel-system @@
  ...
166,166                 name: babel-infra-config
167     -         image: ghcr.io/babelcloud/babel-frontend:a328754
    167 +         image: ghcr.io/babelcloud/babel-frontend:b439809
168,168           imagePullPolicy: IfNotPresent
169,169           livenessProbe:
@@ create deployment/gru-home (apps/v1) namespace: babel-system @@
      0 + apiVersion: apps/v1
      1 + kind: Deployment
      2 + metadata:
      3 +   annotations:
      4 +     kapp.k14s.io/change-group: gru-home
      5 +   labels:
      6 +     app.kubernetes.io/name: babel-home
      7 +     app.kubernetes.io/part-of: babel-system
      8 +     app.kubernetes.io/version: 0.0.1
      9 +     kapp.k14s.io/app: "1721490507501923000"
     10 +     kapp.k14s.io/association: v1.63a93e8e801c7856bfa30f30ed17193b
     11 +     name: babel-home
     12 +   name: gru-home
     13 +   namespace: babel-system
     14 + spec:
     15 +   replicas: 1
     16 +   selector:
     17 +     matchLabels:
     18 +       kapp.k14s.io/app: "1721490507501923000"
     19 +       module: gru-home
     20 +   template:
     21 +     metadata:
     22 +       labels:
     23 +         kapp.k14s.io/app: "1721490507501923000"
     24 +         kapp.k14s.io/association: v1.63a93e8e801c7856bfa30f30ed17193b
     25 +         module: gru-home
     26 +     spec:
     27 +       containers:
     28 +       - image: ghcr.io/babelcloud/gru-home:da87289
     29 +         imagePullPolicy: IfNotPresent
     30 +         livenessProbe:
     31 +           failureThreshold: 6
     32 +           initialDelaySeconds: 10
     33 +           periodSeconds: 10
     34 +           tcpSocket:
     35 +             port: 3011
     36 +           timeoutSeconds: 3
     37 +         name: gru-home
     38 +         readinessProbe:
     39 +           failureThreshold: 3
     40 +           initialDelaySeconds: 10
     41 +           periodSeconds: 10
     42 +           tcpSocket:
     43 +             port: 3011
     44 +           timeoutSeconds: 3
     45 +       imagePullSecrets:
     46 +       - name: regcred
     47 +
@@ create service/gru-home (v1) namespace: babel-system @@
      0 + apiVersion: v1
      1 + kind: Service
      2 + metadata:
      3 +   labels:
      4 +     kapp.k14s.io/app: "1721490507501923000"
      5 +     kapp.k14s.io/association: v1.e383ef03667254be38097fbc78aeb80e
      6 +     module: gru-home
      7 +   name: gru-home
      8 +   namespace: babel-system
      9 + spec:
     10 +   ports:
     11 +   - port: 3011
     12 +   selector:
     13 +     kapp.k14s.io/app: "1721490507501923000"
     14 +     module: gru-home
     15 +   type: ClusterIP
     16 +
@@ update deployment/babel-toolbox (apps/v1) namespace: babel-tenant @@
  ...
190,190           - name: KUBERNETES_PORT_443_TCP_PORT
191     -         image: ghcr.io/babelcloud/babel-toolbox:e5f858b
    191 +         image: ghcr.io/babelcloud/babel-toolbox:f03e8d9
192,192           imagePullPolicy: IfNotPresent
193,193           livenessProbe:

Changes

Namespace     Name                           Kind        Age  Op      Op st.  Wait to    Rs  Ri
babel-system  babel-agent                    Deployment  53d  update  -       reconcile  ok  -
^             babel-ai-proxy                 Deployment  53d  update  -       reconcile  ok  -
^             babel-controller               Deployment  53d  update  -       reconcile  ok  -
^             babel-entrypoint               Deployment  53d  update  -       reconcile  ok  -
^             babel-entrypoint-config-ver-6  ConfigMap   -    create  -       reconcile  -   -
^             babel-frontend                 Deployment  53d  update  -       reconcile  ok  -
^             gru-home                       Deployment  -    create  -       reconcile  -   -
^             gru-home                       Service     -    create  -       reconcile  -   -
babel-tenant  babel-toolbox                  Deployment  53d  update  -       reconcile  ok  -

Op:      3 create, 0 delete, 6 update, 0 noop, 0 exists
Wait to: 9 reconcile, 0 delete, 0 noop

12:49:33PM: ---- applying 1 changes [0/9 done] ----
12:49:33PM: create configmap/babel-entrypoint-config-ver-6 (v1) namespace: babel-system
12:49:33PM: ---- waiting on 1 changes [0/9 done] ----
12:49:33PM: ok: reconcile configmap/babel-entrypoint-config-ver-6 (v1) namespace: babel-system
12:49:33PM: ---- applying 5 changes [1/9 done] ----
12:49:33PM: create deployment/gru-home (apps/v1) namespace: babel-system
12:49:33PM: update deployment/babel-entrypoint (apps/v1) namespace: babel-system
12:49:33PM: create service/gru-home (v1) namespace: babel-system
12:49:33PM: update deployment/babel-ai-proxy (apps/v1) namespace: babel-system
12:49:33PM: update deployment/babel-toolbox (apps/v1) namespace: babel-tenant
12:49:33PM: ---- waiting on 5 changes [1/9 done] ----
12:49:33PM: ok: reconcile service/gru-home (v1) namespace: babel-system
12:49:33PM: ongoing: reconcile deployment/gru-home (apps/v1) namespace: babel-system
12:49:33PM:  ^ Waiting for generation 2 to be observed
12:49:33PM:  L ok: waiting on replicaset/gru-home-7f777f9b76 (apps/v1) namespace: babel-system
12:49:33PM: ongoing: reconcile deployment/babel-toolbox (apps/v1) namespace: babel-tenant
12:49:33PM:  ^ Waiting for generation 16 to be observed
12:49:33PM:  L ok: waiting on replicaset/babel-toolbox-c4d579fb7 (apps/v1) namespace: babel-tenant
12:49:33PM:  L ok: waiting on replicaset/babel-toolbox-9b4996d89 (apps/v1) namespace: babel-tenant
12:49:33PM:  L ok: waiting on replicaset/babel-toolbox-7dd79dc48b (apps/v1) namespace: babel-tenant
12:49:33PM:  L ok: waiting on replicaset/babel-toolbox-788988f978 (apps/v1) namespace: babel-tenant
12:49:33PM:  L ok: waiting on replicaset/babel-toolbox-76fbb85c4b (apps/v1) namespace: babel-tenant
12:49:33PM:  L ok: waiting on replicaset/babel-toolbox-75559ffd6f (apps/v1) namespace: babel-tenant
12:49:33PM:  L ok: waiting on replicaset/babel-toolbox-7469fbdfc4 (apps/v1) namespace: babel-tenant
12:49:33PM:  L ok: waiting on replicaset/babel-toolbox-649569bf96 (apps/v1) namespace: babel-tenant
12:49:33PM:  L ok: waiting on pod/babel-toolbox-7469fbdfc4-z9wf7 (v1) namespace: babel-tenant
12:49:33PM: ongoing: reconcile deployment/babel-entrypoint (apps/v1) namespace: babel-system
12:49:33PM:  ^ Waiting for generation 12 to be observed
12:49:33PM:  L ok: waiting on replicaset/babel-entrypoint-fc87b9c85 (apps/v1) namespace: babel-system
12:49:33PM:  L ok: waiting on replicaset/babel-entrypoint-df6ff574c (apps/v1) namespace: babel-system
12:49:33PM:  L ok: waiting on replicaset/babel-entrypoint-b945d86b6 (apps/v1) namespace: babel-system
12:49:33PM:  L ok: waiting on replicaset/babel-entrypoint-7d9589679b (apps/v1) namespace: babel-system
12:49:33PM:  L ok: waiting on replicaset/babel-entrypoint-676744787b (apps/v1) namespace: babel-system
12:49:33PM:  L ok: waiting on replicaset/babel-entrypoint-6488fbb7dd (apps/v1) namespace: babel-system
12:49:33PM:  L ok: waiting on pod/babel-entrypoint-fc87b9c85-jcwnb (v1) namespace: babel-system
12:49:33PM: ongoing: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
12:49:33PM:  ^ Waiting for generation 17 to be observed
12:49:33PM:  L ok: waiting on replicaset/babel-ai-proxy-f77d895f (apps/v1) namespace: babel-system
12:49:33PM:  L ok: waiting on replicaset/babel-ai-proxy-f4fb44f78 (apps/v1) namespace: babel-system
12:49:33PM:  L ok: waiting on replicaset/babel-ai-proxy-cdbf94b64 (apps/v1) namespace: babel-system
12:49:33PM:  L ok: waiting on replicaset/babel-ai-proxy-c4bbf9b54 (apps/v1) namespace: babel-system
12:49:33PM:  L ok: waiting on replicaset/babel-ai-proxy-847ffd96f4 (apps/v1) namespace: babel-system
12:49:33PM:  L ok: waiting on replicaset/babel-ai-proxy-6fcc94545d (apps/v1) namespace: babel-system
12:49:33PM:  L ok: waiting on replicaset/babel-ai-proxy-6fc98f56f9 (apps/v1) namespace: babel-system
12:49:33PM:  L ok: waiting on replicaset/babel-ai-proxy-664879578b (apps/v1) namespace: babel-system
12:49:33PM:  L ok: waiting on replicaset/babel-ai-proxy-657cbdcdf9 (apps/v1) namespace: babel-system
12:49:33PM:  L ok: waiting on replicaset/babel-ai-proxy-64fd6dc7c8 (apps/v1) namespace: babel-system
12:49:33PM:  L ok: waiting on pod/babel-ai-proxy-f4fb44f78-hmrvc (v1) namespace: babel-system
12:49:33PM: ---- waiting on 4 changes [2/9 done] ----
12:49:34PM: ongoing: reconcile deployment/gru-home (apps/v1) namespace: babel-system
12:49:34PM:  ^ Waiting for 1 unavailable replicas
12:49:34PM:  L ok: waiting on replicaset/gru-home-7f777f9b76 (apps/v1) namespace: babel-system
12:49:34PM:  L ongoing: waiting on pod/gru-home-7f777f9b76-qgspf (v1) namespace: babel-system
12:49:34PM:     ^ Pending: ContainerCreating
12:49:34PM: ongoing: reconcile deployment/babel-toolbox (apps/v1) namespace: babel-tenant
12:49:34PM:  ^ Waiting for 1 unavailable replicas
12:49:34PM:  L ok: waiting on replicaset/babel-toolbox-c4d579fb7 (apps/v1) namespace: babel-tenant
12:49:34PM:  L ok: waiting on replicaset/babel-toolbox-9b4996d89 (apps/v1) namespace: babel-tenant
12:49:34PM:  L ok: waiting on replicaset/babel-toolbox-7dd79dc48b (apps/v1) namespace: babel-tenant
12:49:34PM:  L ok: waiting on replicaset/babel-toolbox-788988f978 (apps/v1) namespace: babel-tenant
12:49:34PM:  L ok: waiting on replicaset/babel-toolbox-76fbb85c4b (apps/v1) namespace: babel-tenant
12:49:34PM:  L ok: waiting on replicaset/babel-toolbox-75559ffd6f (apps/v1) namespace: babel-tenant
12:49:34PM:  L ok: waiting on replicaset/babel-toolbox-7469fbdfc4 (apps/v1) namespace: babel-tenant
12:49:34PM:  L ok: waiting on replicaset/babel-toolbox-649569bf96 (apps/v1) namespace: babel-tenant
12:49:34PM:  L ongoing: waiting on pod/babel-toolbox-788988f978-b8sgf (v1) namespace: babel-tenant
12:49:34PM:     ^ Pending
12:49:34PM:  L ok: waiting on pod/babel-toolbox-7469fbdfc4-z9wf7 (v1) namespace: babel-tenant
12:49:34PM: ongoing: reconcile deployment/babel-entrypoint (apps/v1) namespace: babel-system
12:49:34PM:  ^ Waiting for 1 unavailable replicas
12:49:34PM:  L ok: waiting on replicaset/babel-entrypoint-fc87b9c85 (apps/v1) namespace: babel-system
12:49:34PM:  L ok: waiting on replicaset/babel-entrypoint-df6ff574c (apps/v1) namespace: babel-system
12:49:34PM:  L ok: waiting on replicaset/babel-entrypoint-b945d86b6 (apps/v1) namespace: babel-system
12:49:34PM:  L ok: waiting on replicaset/babel-entrypoint-7d9589679b (apps/v1) namespace: babel-system
12:49:34PM:  L ok: waiting on replicaset/babel-entrypoint-676744787b (apps/v1) namespace: babel-system
12:49:34PM:  L ok: waiting on replicaset/babel-entrypoint-6488fbb7dd (apps/v1) namespace: babel-system
12:49:34PM:  L ok: waiting on pod/babel-entrypoint-fc87b9c85-jcwnb (v1) namespace: babel-system
12:49:34PM:  L ongoing: waiting on pod/babel-entrypoint-7d9589679b-2kxpj (v1) namespace: babel-system
12:49:34PM:     ^ Pending: ContainerCreating
12:49:34PM: ongoing: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
12:49:34PM:  ^ Waiting for generation 17 to be observed
12:49:34PM:  L ok: waiting on replicaset/babel-ai-proxy-f77d895f (apps/v1) namespace: babel-system
12:49:34PM:  L ok: waiting on replicaset/babel-ai-proxy-f4fb44f78 (apps/v1) namespace: babel-system
12:49:34PM:  L ok: waiting on replicaset/babel-ai-proxy-cdbf94b64 (apps/v1) namespace: babel-system
12:49:34PM:  L ok: waiting on replicaset/babel-ai-proxy-c4bbf9b54 (apps/v1) namespace: babel-system
12:49:34PM:  L ok: waiting on replicaset/babel-ai-proxy-847ffd96f4 (apps/v1) namespace: babel-system
12:49:34PM:  L ok: waiting on replicaset/babel-ai-proxy-6fcc94545d (apps/v1) namespace: babel-system
12:49:34PM:  L ok: waiting on replicaset/babel-ai-proxy-6fc98f56f9 (apps/v1) namespace: babel-system
12:49:34PM:  L ok: waiting on replicaset/babel-ai-proxy-664879578b (apps/v1) namespace: babel-system
12:49:34PM:  L ok: waiting on replicaset/babel-ai-proxy-657cbdcdf9 (apps/v1) namespace: babel-system
12:49:34PM:  L ok: waiting on replicaset/babel-ai-proxy-64fd6dc7c8 (apps/v1) namespace: babel-system
12:49:34PM:  L ongoing: waiting on pod/babel-ai-proxy-f77d895f-64cxt (v1) namespace: babel-system
12:49:34PM:     ^ Pending
12:49:34PM:  L ok: waiting on pod/babel-ai-proxy-f4fb44f78-hmrvc (v1) namespace: babel-system
12:49:37PM: ok: reconcile deployment/babel-entrypoint (apps/v1) namespace: babel-system
12:49:37PM: ongoing: reconcile deployment/gru-home (apps/v1) namespace: babel-system
12:49:37PM:  ^ Waiting for 1 unavailable replicas
12:49:37PM:  L ok: waiting on replicaset/gru-home-7f777f9b76 (apps/v1) namespace: babel-system
12:49:37PM:  L ongoing: waiting on pod/gru-home-7f777f9b76-qgspf (v1) namespace: babel-system
12:49:37PM:     ^ Condition Ready is not True (False)
12:49:37PM: ongoing: reconcile deployment/babel-toolbox (apps/v1) namespace: babel-tenant
12:49:37PM:  ^ Waiting for 1 unavailable replicas
12:49:37PM:  L ok: waiting on replicaset/babel-toolbox-c4d579fb7 (apps/v1) namespace: babel-tenant
12:49:37PM:  L ok: waiting on replicaset/babel-toolbox-9b4996d89 (apps/v1) namespace: babel-tenant
12:49:37PM:  L ok: waiting on replicaset/babel-toolbox-7dd79dc48b (apps/v1) namespace: babel-tenant
12:49:37PM:  L ok: waiting on replicaset/babel-toolbox-788988f978 (apps/v1) namespace: babel-tenant
12:49:37PM:  L ok: waiting on replicaset/babel-toolbox-76fbb85c4b (apps/v1) namespace: babel-tenant
12:49:37PM:  L ok: waiting on replicaset/babel-toolbox-75559ffd6f (apps/v1) namespace: babel-tenant
12:49:37PM:  L ok: waiting on replicaset/babel-toolbox-7469fbdfc4 (apps/v1) namespace: babel-tenant
12:49:37PM:  L ok: waiting on replicaset/babel-toolbox-649569bf96 (apps/v1) namespace: babel-tenant
12:49:37PM:  L ongoing: waiting on pod/babel-toolbox-788988f978-b8sgf (v1) namespace: babel-tenant
12:49:37PM:     ^ Condition Ready is not True (False)
12:49:37PM:  L ok: waiting on pod/babel-toolbox-7469fbdfc4-z9wf7 (v1) namespace: babel-tenant
12:49:37PM: ongoing: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
12:49:37PM:  ^ Waiting for 1 unavailable replicas
12:49:37PM:  L ok: waiting on replicaset/babel-ai-proxy-f77d895f (apps/v1) namespace: babel-system
12:49:37PM:  L ok: waiting on replicaset/babel-ai-proxy-f4fb44f78 (apps/v1) namespace: babel-system
12:49:37PM:  L ok: waiting on replicaset/babel-ai-proxy-cdbf94b64 (apps/v1) namespace: babel-system
12:49:37PM:  L ok: waiting on replicaset/babel-ai-proxy-c4bbf9b54 (apps/v1) namespace: babel-system
12:49:37PM:  L ok: waiting on replicaset/babel-ai-proxy-847ffd96f4 (apps/v1) namespace: babel-system
12:49:37PM:  L ok: waiting on replicaset/babel-ai-proxy-6fcc94545d (apps/v1) namespace: babel-system
12:49:37PM:  L ok: waiting on replicaset/babel-ai-proxy-6fc98f56f9 (apps/v1) namespace: babel-system
12:49:37PM:  L ok: waiting on replicaset/babel-ai-proxy-664879578b (apps/v1) namespace: babel-system
12:49:37PM:  L ok: waiting on replicaset/babel-ai-proxy-657cbdcdf9 (apps/v1) namespace: babel-system
12:49:37PM:  L ok: waiting on replicaset/babel-ai-proxy-64fd6dc7c8 (apps/v1) namespace: babel-system
12:49:37PM:  L ongoing: waiting on pod/babel-ai-proxy-f77d895f-64cxt (v1) namespace: babel-system
12:49:37PM:     ^ Condition Ready is not True (False)
12:49:37PM:  L ok: waiting on pod/babel-ai-proxy-f4fb44f78-hmrvc (v1) namespace: babel-system
12:49:37PM: ---- waiting on 3 changes [3/9 done] ----
12:49:46PM: ok: reconcile deployment/gru-home (apps/v1) namespace: babel-system
12:49:46PM: ok: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
12:49:46PM: ---- applying 1 changes [6/9 done] ----
12:49:47PM: update deployment/babel-agent (apps/v1) namespace: babel-system
12:49:47PM: ---- waiting on 2 changes [5/9 done] ----
12:49:47PM: ongoing: reconcile deployment/babel-agent (apps/v1) namespace: babel-system
12:49:47PM:  ^ Waiting for generation 49 to be observed
12:49:47PM:  L ok: waiting on replicaset/babel-agent-85b7978cb7 (apps/v1) namespace: babel-system
12:49:47PM:  L ok: waiting on replicaset/babel-agent-845dcc76db (apps/v1) namespace: babel-system
12:49:47PM:  L ok: waiting on replicaset/babel-agent-7cbdbbc696 (apps/v1) namespace: babel-system
12:49:47PM:  L ok: waiting on replicaset/babel-agent-79c4f5c598 (apps/v1) namespace: babel-system
12:49:47PM:  L ok: waiting on replicaset/babel-agent-74dcf895f5 (apps/v1) namespace: babel-system
12:49:47PM:  L ok: waiting on replicaset/babel-agent-6f8b64c7fb (apps/v1) namespace: babel-system
12:49:47PM:  L ok: waiting on replicaset/babel-agent-6c5bb948dc (apps/v1) namespace: babel-system
12:49:47PM:  L ok: waiting on replicaset/babel-agent-64fb48c56 (apps/v1) namespace: babel-system
12:49:47PM:  L ok: waiting on replicaset/babel-agent-5ddff6c776 (apps/v1) namespace: babel-system
12:49:47PM:  L ok: waiting on replicaset/babel-agent-5cccb887bc (apps/v1) namespace: babel-system
12:49:47PM:  L ok: waiting on replicaset/babel-agent-56dfb9dffc (apps/v1) namespace: babel-system
12:49:50PM: ok: reconcile deployment/babel-agent (apps/v1) namespace: babel-system
12:49:50PM: ---- applying 1 changes [7/9 done] ----
12:49:51PM: update deployment/babel-controller (apps/v1) namespace: babel-system
12:49:51PM: ---- waiting on 2 changes [6/9 done] ----
12:49:51PM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
12:49:51PM:  ^ Waiting for generation 51 to be observed
12:49:51PM:  L ok: waiting on replicaset/babel-controller-df4ff8846 (apps/v1) namespace: babel-system
12:49:51PM:  L ok: waiting on replicaset/babel-controller-cc449bbd4 (apps/v1) namespace: babel-system
12:49:51PM:  L ok: waiting on replicaset/babel-controller-8565b956f7 (apps/v1) namespace: babel-system
12:49:51PM:  L ok: waiting on replicaset/babel-controller-84b594bb8 (apps/v1) namespace: babel-system
12:49:51PM:  L ok: waiting on replicaset/babel-controller-7f74845599 (apps/v1) namespace: babel-system
12:49:51PM:  L ok: waiting on replicaset/babel-controller-7c94559b9f (apps/v1) namespace: babel-system
12:49:51PM:  L ok: waiting on replicaset/babel-controller-74dd56977 (apps/v1) namespace: babel-system
12:49:51PM:  L ok: waiting on replicaset/babel-controller-747bfc57f6 (apps/v1) namespace: babel-system
12:49:51PM:  L ok: waiting on replicaset/babel-controller-6f4d79dbb6 (apps/v1) namespace: babel-system
12:49:51PM:  L ok: waiting on replicaset/babel-controller-6b5fb485bc (apps/v1) namespace: babel-system
12:49:51PM:  L ok: waiting on replicaset/babel-controller-5dd8f4596c (apps/v1) namespace: babel-system
12:49:51PM:  L ok: waiting on replicaset/babel-controller-57689d8957 (apps/v1) namespace: babel-system
12:49:51PM:  L ok: waiting on pod/babel-controller-8565b956f7-dkdpt (v1) namespace: babel-system
12:49:51PM:  L ongoing: waiting on pod/babel-controller-6b5fb485bc-cgv5g (v1) namespace: babel-system
12:49:51PM:     ^ Pending: PodInitializing
12:49:54PM: ok: reconcile deployment/babel-toolbox (apps/v1) namespace: babel-tenant
12:49:54PM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
12:49:54PM:  ^ Waiting for 1 unavailable replicas
12:49:54PM:  L ok: waiting on replicaset/babel-controller-df4ff8846 (apps/v1) namespace: babel-system
12:49:54PM:  L ok: waiting on replicaset/babel-controller-cc449bbd4 (apps/v1) namespace: babel-system
12:49:54PM:  L ok: waiting on replicaset/babel-controller-8565b956f7 (apps/v1) namespace: babel-system
12:49:54PM:  L ok: waiting on replicaset/babel-controller-84b594bb8 (apps/v1) namespace: babel-system
12:49:54PM:  L ok: waiting on replicaset/babel-controller-7f74845599 (apps/v1) namespace: babel-system
12:49:54PM:  L ok: waiting on replicaset/babel-controller-7c94559b9f (apps/v1) namespace: babel-system
12:49:54PM:  L ok: waiting on replicaset/babel-controller-74dd56977 (apps/v1) namespace: babel-system
12:49:54PM:  L ok: waiting on replicaset/babel-controller-747bfc57f6 (apps/v1) namespace: babel-system
12:49:54PM:  L ok: waiting on replicaset/babel-controller-6f4d79dbb6 (apps/v1) namespace: babel-system
12:49:54PM:  L ok: waiting on replicaset/babel-controller-6b5fb485bc (apps/v1) namespace: babel-system
12:49:54PM:  L ok: waiting on replicaset/babel-controller-5dd8f4596c (apps/v1) namespace: babel-system
12:49:54PM:  L ok: waiting on replicaset/babel-controller-57689d8957 (apps/v1) namespace: babel-system
12:49:54PM:  L ok: waiting on pod/babel-controller-8565b956f7-dkdpt (v1) namespace: babel-system
12:49:54PM:  L ongoing: waiting on pod/babel-controller-6b5fb485bc-cgv5g (v1) namespace: babel-system
12:49:54PM:     ^ Condition Ready is not True (False)
12:49:54PM: ---- waiting on 1 changes [7/9 done] ----
12:50:21PM: ok: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
12:50:21PM: ---- applying 1 changes [8/9 done] ----
12:50:21PM: update deployment/babel-frontend (apps/v1) namespace: babel-system
12:50:21PM: ---- waiting on 1 changes [8/9 done] ----
12:50:21PM: ongoing: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
12:50:21PM:  ^ Waiting for generation 38 to be observed
12:50:21PM:  L ok: waiting on replicaset/babel-frontend-fcb7c87dd (apps/v1) namespace: babel-system
12:50:21PM:  L ok: waiting on replicaset/babel-frontend-c9fcf49f5 (apps/v1) namespace: babel-system
12:50:21PM:  L ok: waiting on replicaset/babel-frontend-b68f7cf9b (apps/v1) namespace: babel-system
12:50:21PM:  L ok: waiting on replicaset/babel-frontend-767cc84cfd (apps/v1) namespace: babel-system
12:50:21PM:  L ok: waiting on replicaset/babel-frontend-6b979c4648 (apps/v1) namespace: babel-system
12:50:21PM:  L ok: waiting on replicaset/babel-frontend-6446bdfffd (apps/v1) namespace: babel-system
12:50:21PM:  L ok: waiting on replicaset/babel-frontend-5ff48b84b4 (apps/v1) namespace: babel-system
12:50:21PM:  L ok: waiting on replicaset/babel-frontend-5cc79b84d7 (apps/v1) namespace: babel-system
12:50:21PM:  L ok: waiting on replicaset/babel-frontend-59cd84567d (apps/v1) namespace: babel-system
12:50:21PM:  L ok: waiting on replicaset/babel-frontend-59485bc9d9 (apps/v1) namespace: babel-system
12:50:21PM:  L ok: waiting on replicaset/babel-frontend-5864b55844 (apps/v1) namespace: babel-system
12:50:21PM:  L ok: waiting on replicaset/babel-frontend-555cb8f5b6 (apps/v1) namespace: babel-system
12:50:21PM:  L ongoing: waiting on pod/babel-frontend-767cc84cfd-drzfr (v1) namespace: babel-system
12:50:21PM:     ^ Pending
12:50:21PM:  L ok: waiting on pod/babel-frontend-59485bc9d9-nccq9 (v1) namespace: babel-system
12:50:24PM: ongoing: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
12:50:24PM:  ^ Waiting for 1 unavailable replicas
12:50:24PM:  L ok: waiting on replicaset/babel-frontend-fcb7c87dd (apps/v1) namespace: babel-system
12:50:24PM:  L ok: waiting on replicaset/babel-frontend-c9fcf49f5 (apps/v1) namespace: babel-system
12:50:24PM:  L ok: waiting on replicaset/babel-frontend-b68f7cf9b (apps/v1) namespace: babel-system
12:50:24PM:  L ok: waiting on replicaset/babel-frontend-767cc84cfd (apps/v1) namespace: babel-system
12:50:24PM:  L ok: waiting on replicaset/babel-frontend-6b979c4648 (apps/v1) namespace: babel-system
12:50:24PM:  L ok: waiting on replicaset/babel-frontend-6446bdfffd (apps/v1) namespace: babel-system
12:50:24PM:  L ok: waiting on replicaset/babel-frontend-5ff48b84b4 (apps/v1) namespace: babel-system
12:50:24PM:  L ok: waiting on replicaset/babel-frontend-5cc79b84d7 (apps/v1) namespace: babel-system
12:50:24PM:  L ok: waiting on replicaset/babel-frontend-59cd84567d (apps/v1) namespace: babel-system
12:50:24PM:  L ok: waiting on replicaset/babel-frontend-59485bc9d9 (apps/v1) namespace: babel-system
12:50:24PM:  L ok: waiting on replicaset/babel-frontend-5864b55844 (apps/v1) namespace: babel-system
12:50:24PM:  L ok: waiting on replicaset/babel-frontend-555cb8f5b6 (apps/v1) namespace: babel-system
12:50:24PM:  L ongoing: waiting on pod/babel-frontend-767cc84cfd-drzfr (v1) namespace: babel-system
12:50:24PM:     ^ Condition Ready is not True (False)
12:50:24PM:  L ok: waiting on pod/babel-frontend-59485bc9d9-nccq9 (v1) namespace: babel-system
12:50:33PM: ok: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
12:50:33PM: ---- applying complete [9/9 done] ----
12:50:33PM: ---- waiting complete [9/9 done] ----

Succeeded
Deleted: ghcr.io/babelcloud/babel-ai-proxy:a9291e2
 ➜ Setup port forwarding...
Force restart or not running process found, clean-up kwt-net pod...
No proxy needed, you are outside the wall.
Stopping `supervisor`... (might take a while)
==> Successfully stopped `supervisor` (label: homebrew.mxcl.supervisor)
 ✔ Port forwarding completed, elapsed 6.192s
 ✔ Installed Babel App, elapsed 6m 16s
git pull
remote: Enumerating objects: 102, done.
remote: Counting objects: 100% (102/102), done.
remote: Compressing objects: 100% (59/59), done.
remote: Total 102 (delta 54), reused 88 (delta 43), pack-reused 0 (from 0)
Receiving objects: 100% (102/102), 23.21 KiB | 1.10 MiB/s, done.
Resolving deltas: 100% (54/54), completed with 9 local objects.
From github.com:babelcloud/babel-umbrella
   3b34baf..37e4da4  main       -> origin/main
 * [new tag]         prod-2024.09.14-1 -> prod-2024.09.14-1
 * [new tag]         prod-2024.09.14-2 -> prod-2024.09.14-2
 * [new tag]         prod-2024.09.14-3 -> prod-2024.09.14-3
 * [new tag]         prod-2024.09.16-1 -> prod-2024.09.16-1
Fetching submodule agent
From github.com:babelcloud/babel-agent
   6ef9a43..3f6b6b1  main       -> origin/main
 * [new branch]      vitester-src-agents-framework-knowledge-ts -> origin/vitester-src-agents-framework-knowledge-ts
 * [new branch]      vitester-src-agents-utils-misc-is-verbose-ts -> origin/vitester-src-agents-utils-misc-is-verbose-ts
 * [new branch]      vitester-src-models-common-utils-ts -> origin/vitester-src-models-common-utils-ts
 * [new branch]      vitester-src-models-conversation-conversation-mapper-ts -> origin/vitester-src-models-conversation-conversation-mapper-ts
Fetching submodule ai-proxy
From github.com:babelcloud/babel-ai-proxy
   df356c1..c41650e  main       -> origin/main
 * [new branch]      vangie/support-openai-o1-model -> origin/vangie/support-openai-o1-model
Fetching submodule controller
From github.com:babelcloud/babel-controller
   4105250..3173c09  main       -> origin/main
Fetching submodule frontend
From github.com:babelcloud/babel-frontend
   b4398093..527d1077  main       -> origin/main
Fetching submodule test
From github.com:babelcloud/babel-test
   3c0d1c9..88ab1c1  main       -> origin/main
Updating 3b34baf..37e4da4
Fast-forward
 agent                                                   |   2 +-
 ai-proxy                                                |   2 +-
 controller                                              |   2 +-
 deploy/commons/babel/entrypoint.yml                     | 121 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++--------------------------------------
 deploy/local/scripts/charts/openobserve-0.11.3.tgz      | Bin 0 -> 102105 bytes
 deploy/local/scripts/install-app.sh                     |   3 +--
 deploy/local/scripts/install-infra.sh                   |   2 ++
 deploy/local/scripts/install-minio.sh                   |   2 +-
 deploy/local/scripts/install-o2.sh                      |  72 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 deploy/local/scripts/install-pf.sh                      |   3 ++-
 deploy/local/scripts/install-postgresql.sh              |   2 --
 deploy/local/scripts/port-forwarding/babel.conf         |  36 +++++++++++++++++++++++++++---------
 deploy/local/scripts/preload-image/image-list.arm64.txt |   8 +++++++-
 deploy/local/scripts/preload-image/middleware-images.sh |   1 +
 deploy/local/scripts/preload-service-image.sh           |  36 +++++++++++++++++++++---------------
 frontend                                                |   2 +-
 gru-home                                                |   2 +-
 test                                                    |   2 +-
 18 files changed, 223 insertions(+), 75 deletions(-)
 create mode 100644 deploy/local/scripts/charts/openobserve-0.11.3.tgz
 create mode 100755 deploy/local/scripts/install-o2.sh
git submodule update
Submodule path 'agent': checked out '3f6b6b191f556f1b6162d13654cfb2d7b57af71e'
Submodule path 'ai-proxy': checked out 'c41650eeeea47ed5ed7849ff65259f26fa1e1b5f'
Submodule path 'controller': checked out '3173c0990070c3ef3dffa39e9a01fed81fb86f50'
Submodule path 'frontend': checked out '527d1077158c78d4af1b3ddf53645d32aa65af4c'
Submodule path 'test': checked out '88ab1c1aea056d4d5719b9e9bb46e21cc6805f15'
make install-app
Services run locally: agent

 ➜ Preload service images...
   Load image from ~/.cache/babelcloud/images/service/ghcr.io_babelcloud_babel-controller_3173c09.tar.zst
   Load image from ~/.cache/babelcloud/images/service/ghcr.io_babelcloud_babel-frontend_527d107.tar.zst
   Load image from ~/.cache/babelcloud/images/service/ghcr.io_babelcloud_babel-ai-proxy_c41650e.tar.zst
 ✔ Preload service images, elapsed 2m 12s
Target cluster 'https://0.0.0.0:40180' (nodes: babelcloud-control-plane)

@@ create configmap/babel-entrypoint-config-ver-7 (v1) namespace: babel-system @@
  ...
  1,  1   data:
      2 +   gru-home.js: |-
      3 +     async function run(r) {
      4 +       const res = await ngx.fetch(r.variables.login_check_url, {
      5 +         headers: {
      6 +           Cookie: r.variables.login_check_cookie
      7 +         }
      8 +       });
      9 +       if (res.status === 401) {
     10 +         r.internalRedirect('/home');
     11 +       } else {
     12 +         r.return(307, r.variables.redirect_url);
     13 +       }
     14 +     }
     15 +     export default {run};
     16 +   nginx.conf: |-
     17 +     load_module modules/ngx_http_js_module.so;
     18 +
     19 +     user  nginx;
     20 +     worker_processes  auto;
     21 +
     22 +     error_log  /var/log/nginx/error.log notice;
     23 +     pid        /var/run/nginx.pid;
     24 +
     25 +
     26 +     events {
     27 +         worker_connections  1024;
     28 +     }
     29 +
     30 +
     31 +     http {
     32 +         include       /etc/nginx/mime.types;
     33 +         default_type  application/octet-stream;
     34 +
     35 +         log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
     36 +                           '$status $body_bytes_sent "$http_referer" '
     37 +                           '"$http_user_agent" "$http_x_forwarded_for"';
     38 +
     39 +         access_log  /var/log/nginx/access.log  main;
     40 +
     41 +         sendfile        on;
     42 +         #tcp_nopush     on;
     43 +
     44 +         keepalive_timeout  65;
     45 +
     46 +         #gzip  on;
     47 +
     48 +         include /etc/nginx/conf.d/*.conf;
     49 +     }
  2, 50     proxy_params: |-
  3, 51       proxy_http_version 1.1;
  ...
 16, 64
 17     -       set $frontend_upstream http://${FRONTEND}:${FRONTEND_PORT};
     65 +       set $frontend_upstream http://${FRONTEND_ENDPOINT};
 18, 66
 19, 67         location = / {
  ...
 38, 86
 39     -       set $home_upstream http://${HOME}:${HOME_PORT};
     87 +       set $home_upstream http://${HOME_ENDPOINT};
 40, 88
 41, 89         location / {
  ...
 53,101
 54     -       set $home_upstream http://${GRU_HOME}:${GRU_HOME_PORT};
 55     -       set $frontend_upstream http://${FRONTEND}:${FRONTEND_PORT};
 56     -       set $admin_upstream http://${ADMIN}:${ADMIN_PORT};
    102 +       set $home_upstream http://${GRU_HOME_ENDPOINT};
    103 +       set $frontend_upstream http://${FRONTEND_ENDPOINT};
    104 +       set $admin_upstream http://${ADMIN_ENDPOINT};
    105 +       set $controller_upstream http://${CONTROLLER_ENDPOINT};
 57,106
 58,107         location /blog {
 59     -         rewrite ^(.+[^/])$ $http_x_forwarded_proto://$host:$http_x_forwarded_port$1/ permanent;
 60     -
 61,108           proxy_set_header        Host                    babelcloud.github.io;
 62,109           proxy_set_header        X-Host                  babelcloud.github.io;
  ...
 69,116         location /admin {
 70     -         rewrite ^(.+[^/])$ $http_x_forwarded_proto://$host:$http_x_forwarded_port$1/ permanent;
 71     -
 72,117           include proxy_params;
 73,118
  ...
 81,126         }
 82     -
 83     -       location =/ {
 84     -         include proxy_params;
 85     -
 86     -         if ($http_cookie ~* "SESSION=") {
 87     -           return 307 $http_x_forwarded_proto://$host:$http_x_forwarded_port/new;
 88     -         }
 89,127
 90     -         proxy_pass $home_upstream;
    128 +       location = / {
    129 +         js_import gruHome from /etc/nginx/njs/gru-home.js ;
    130 +         js_content gruHome.run;
    131 +         js_var $login_check_url $controller_upstream/api/account;
    132 +         js_var $login_check_cookie $http_cookie;
    133 +         js_var $redirect_url $http_x_forwarded_proto://$host:$http_x_forwarded_port/new;
 91,134         }
 92,135
  ...
122,165
123     -       set $agent_upstream http://${AGENT}:${AGENT_PORT};
    166 +       set $agent_upstream http://${AGENT_ENDPOINT};
124,167
125,168         location / {
@@ delete configmap/babel-entrypoint-config-ver-1 (v1) namespace: babel-system @@
  0     - apiVersion: v1
  1     - data:
  2     -   proxy_params: |-
  3     -     proxy_http_version 1.1;
  4     -     proxy_set_header   Upgrade $http_upgrade;
  5     -     proxy_set_header   Connection "Upgrade";
  6     -     proxy_set_header   Host $host;
  7     -   server.conf.template: |-
  8     -     server {
  9     -       listen       13000;
 10     -       listen  [::]:13000;
 11     -       server_name  "${BABELCLOUD_BABEL_SERVER_NAME}";
 12     -
 13     -       resolver ${DNS_SERVER} valid=${DNS_VALID_TIME};
 14     -
 15     -       set $frontend_upstream http://${FRONTEND}:${FRONTEND_PORT};
 16     -
 17     -       location = / {
 18     -         include proxy_params;
 19     -
 20     -         proxy_pass $frontend_upstream;
 21     -       }
 22     -
 23     -       location / {
 24     -         include proxy_params;
 25     -
 26     -         proxy_pass $frontend_upstream;
 27     -       }
 28     -     }
 29     -
 30     -     server {
 31     -       listen       13000;
 32     -       listen  [::]:13000;
 33     -       server_name  "${BABELCLOUD_PORTAL_SERVER_NAME}";
 34     -
 35     -       resolver ${DNS_SERVER} valid=${DNS_VALID_TIME};
 36     -
 37     -       set $home_upstream http://${HOME}:${HOME_PORT};
 38     -
 39     -       location / {
 40     -         include proxy_params;
 41     -         proxy_pass $home_upstream;
 42     -       }
 43     -     }
 44     -
 45     -     server {
 46     -       listen       13000;
 47     -       listen  [::]:13000;
 48     -       server_name  "${BABELCLOUD_GRU_SERVER_NAME}";
 49     -
 50     -       resolver ${DNS_SERVER} valid=${DNS_VALID_TIME};
 51     -
 52     -       set $frontend_upstream http://${FRONTEND}:${FRONTEND_PORT};
 53     -       set $admin_upstream http://${ADMIN}:${ADMIN_PORT};
 54     -
 55     -       location /blog {
 56     -         proxy_set_header        Host                    babelcloud.github.io;
 57     -         proxy_set_header        X-Host                  babelcloud.github.io;
 58     -         proxy_set_header        X-Real-IP               $remote_addr;
 59     -         proxy_set_header        X-Forwarded-For         $proxy_add_x_forwarded_for;
 60     -         proxy_set_header        X-Forwarded-Protocol    $http_x_forwarded_proto;
 61     -         proxy_pass https://babelcloud.github.io/blog/;
 62     -       }
 63     -
 64     -       location /admin {
 65     -         include proxy_params;
 66     -
 67     -         proxy_pass $admin_upstream;
 68     -       }
 69     -
 70     -       location / {
 71     -         include proxy_params;
 72     -
 73     -         proxy_pass $frontend_upstream;
 74     -       }
 75     -     }
 76     -
 77     -     server {
 78     -       listen       13000;
 79     -       listen  [::]:13000;
 80     -       server_name  "www.${BABELCLOUD_PORTAL_SERVER_NAME}";
 81     -
 82     -       return 301 $http_x_forwarded_proto://${BABELCLOUD_PORTAL_SERVER_NAME}${ENTRYPOINT_PORT}$request_uri;
 83     -     }
 84     -
 85     -     server {
 86     -       listen       13000;
 87     -       listen  [::]:13000;
 88     -       server_name  "www.${BABELCLOUD_BABEL_SERVER_NAME}";
 89     -
 90     -       return 301 $http_x_forwarded_proto://${BABELCLOUD_BABEL_SERVER_NAME}${ENTRYPOINT_PORT}$request_uri;
 91     -     }
 92     -
 93     -     server {
 94     -       listen       13000;
 95     -       listen  [::]:13000;
 96     -       server_name  "www.${BABELCLOUD_GRU_SERVER_NAME}";
 97     -
 98     -       return 301 $http_x_forwarded_proto://${BABELCLOUD_GRU_SERVER_NAME}${ENTRYPOINT_PORT}$request_uri;
 99     -     }
100     -
101     -     server {
102     -       listen       13000;
103     -       listen  [::]:13000;
104     -       server_name  "${RUNTIME_DOMAIN}";
105     -
106     -       return 302 $http_x_forwarded_proto://${BABELCLOUD_BABEL_SERVER_NAME}${ENTRYPOINT_PORT}$request_uri;
107     -     }
108     - kind: ConfigMap
109     - metadata:
110     -   annotations:
111     -     kapp.k14s.io/versioned: ""
112     -   creationTimestamp: "2024-07-20T15:48:27Z"
113     -   labels:
114     -     kapp.k14s.io/app: "1721490507501923000"
115     -     kapp.k14s.io/association: v1.9007c0a5f7f0955d9040cc08c9071338
116     -   managedFields:
117     -   - apiVersion: v1
118     -     fieldsType: FieldsV1
119     -     fieldsV1:
120     -       f:data:
121     -         .: {}
122     -         f:proxy_params: {}
123     -         f:server.conf.template: {}
124     -       f:metadata:
125     -         f:annotations:
126     -           .: {}
127     -           f:kapp.k14s.io/identity: {}
128     -           f:kapp.k14s.io/original: {}
129     -           f:kapp.k14s.io/original-diff-md5: {}
130     -           f:kapp.k14s.io/versioned: {}
131     -         f:labels:
132     -           .: {}
133     -           f:kapp.k14s.io/app: {}
134     -           f:kapp.k14s.io/association: {}
135     -     manager: kapp
136     -     operation: Update
137     -     time: "2024-07-20T15:48:27Z"
138     -   name: babel-entrypoint-config-ver-1
139     -   namespace: babel-system
140     -   resourceVersion: "3485"
141     -   uid: 109170a4-af55-41f7-911d-3fde667c0c6e
142     -
@@ update deployment/babel-agent (apps/v1) namespace: babel-system @@
  ...
690,690                 name: babel-infra-secret
691     -         image: ghcr.io/babelcloud/babel-agent:6ef9a43
    691 +         image: ghcr.io/babelcloud/babel-agent:3f6b6b1
692,692           imagePullPolicy: IfNotPresent
693,693           livenessProbe:
@@ update deployment/babel-ai-proxy (apps/v1) namespace: babel-system @@
  ...
318,318             value: ""
319     -         image: ghcr.io/babelcloud/babel-ai-proxy:df356c1
    319 +         image: ghcr.io/babelcloud/babel-ai-proxy:c41650e
320,320           imagePullPolicy: IfNotPresent
321,321           livenessProbe:
@@ update deployment/babel-controller (apps/v1) namespace: babel-system @@
  ...
535,535           - name: BABELCLOUD_REVISION
536     -           value: 3b34baf79fc6f5741b3cf85888d1baf44a212cbc
    536 +           value: 37e4da4b0349ca53f0d0e7df8b198a83a4f40636
537,537           - name: BABELCLOUD_ENVIRONMENT
538,538             valueFrom:
  ...
782,782             value: "false"
783     -         image: ghcr.io/babelcloud/babel-controller:4105250
    783 +         image: ghcr.io/babelcloud/babel-controller:3173c09
784,784           imagePullPolicy: IfNotPresent
785,785           livenessProbe:
@@ update deployment/babel-entrypoint (apps/v1) namespace: babel-system @@
  ...
  9,  9         kind: ConfigMap
 10     -       name: babel-entrypoint-config-ver-6
     10 +       name: babel-entrypoint-config-ver-7
 11, 11     creationTimestamp: "2024-07-20T15:48:28Z"
 12, 12     generation: 12
  ...
245,245         - env:
246     -         - name: FRONTEND
247     -           value: babel-frontend.babel-system.svc.cluster.local
248     -         - name: HOME
249     -           value: babel-home.babel-system.svc.cluster.local
250     -         - name: FRONTEND_PORT
251     -           value: "3001"
252     -         - name: HOME_PORT
253     -           value: "3002"
254     -         - name: ADMIN
255     -           value: babel-admin.babel-system.svc.cluster.local
256     -         - name: ADMIN_PORT
257     -           value: "3009"
258     -         - name: AGENT
259     -           value: babel-agent-local.babel-system.svc.cluster.local
260     -         - name: AGENT_PORT
261     -           value: "8083"
262     -         - name: GRU_HOME
263     -           value: gru-home.babel-system.svc.cluster.local
264     -         - name: GRU_HOME_PORT
265     -           value: "3011"
    246 +         - name: FRONTEND_ENDPOINT
    247 +           value: babel-frontend.babel-system.svc.cluster.local:3001
    248 +         - name: HOME_ENDPOINT
    249 +           value: babel-home.babel-system.svc.cluster.local:3002
    250 +         - name: ADMIN_ENDPOINT
    251 +           value: babel-admin.babel-system.svc.cluster.local:3009
    252 +         - name: AGENT_ENDPOINT
    253 +           value: babel-agent-local.babel-system.svc.cluster.local:8083
    254 +         - name: GRU_HOME_ENDPOINT
    255 +           value: gru-home.babel-system.svc.cluster.local:3011
    256 +         - name: CONTROLLER_ENDPOINT
    257 +           value: babel-controller.babel-system.svc.cluster.local
266,258           - name: RUNTIME_DOMAIN
267,259             value: 127-0-0-1.sslip.io
  ...
297,289           volumeMounts:
    290 +         - mountPath: /etc/nginx/nginx.conf
    291 +           name: babel-entrypoint-config
    292 +           readOnly: true
    293 +           subPath: nginx.conf
298,294           - mountPath: /etc/nginx/proxy_params
299,295             name: babel-entrypoint-config
  ...
305,301             subPath: server.conf.template
    302 +         - mountPath: /etc/nginx/njs/gru-home.js
    303 +           name: babel-entrypoint-config
    304 +           readOnly: true
    305 +           subPath: gru-home.js
306,306         nodeSelector: null
307,307         volumes:
308,308         - configMap:
309     -           name: babel-entrypoint-config-ver-6
    309 +           name: babel-entrypoint-config-ver-7
310,310           name: babel-entrypoint-config
311,311
@@ update deployment/babel-frontend (apps/v1) namespace: babel-system @@
  ...
166,166                 name: babel-infra-config
167     -         image: ghcr.io/babelcloud/babel-frontend:b439809
    167 +         image: ghcr.io/babelcloud/babel-frontend:527d107
168,168           imagePullPolicy: IfNotPresent
169,169           livenessProbe:
@@ update deployment/gru-home (apps/v1) namespace: babel-system @@
  ...
144,144         containers:
145     -       - image: ghcr.io/babelcloud/gru-home:da87289
    145 +       - image: ghcr.io/babelcloud/gru-home:af4c96e
146,146           imagePullPolicy: IfNotPresent
147,147           livenessProbe:
@@ update service/babel-toolbox (v1) namespace: babel-tenant @@
  ...
  2,  2   metadata:
  3     -   annotations: {}
  4,  3     creationTimestamp: "2024-07-20T15:48:28Z"
  5,  4     labels:
  ...
 54, 53     clusterIP: 10.96.141.65
 55     -   clusterIPs:
 56     -   - 10.96.141.65
 57     -   internalTrafficPolicy: Cluster
 58     -   ipFamilies:
 59     -   - IPv4
 60     -   ipFamilyPolicy: SingleStack
 61, 54     ports:
 62     -   - name: port0
 63     -     port: 3010
 64     -     protocol: TCP
 65     -     targetPort: 46803
     55 +   - port: 3010
 66, 56     selector:
 67     -     kwt.cppforlife.com/net: "true"
 68     -   sessionAffinity: None
     57 +     kapp.k14s.io/app: "1721490507501923000"
     58 +     module: babel-toolbox
 69, 59     type: ClusterIP
 70, 60

Changes

Namespace     Name                           Kind        Age  Op      Op st.  Wait to    Rs  Ri
babel-system  babel-agent                    Deployment  60d  update  -       reconcile  ok  -
^             babel-ai-proxy                 Deployment  60d  update  -       reconcile  ok  -
^             babel-controller               Deployment  60d  update  -       reconcile  ok  -
^             babel-entrypoint               Deployment  60d  update  -       reconcile  ok  -
^             babel-entrypoint-config-ver-1  ConfigMap   60d  delete  -       delete     ok  -
^             babel-entrypoint-config-ver-7  ConfigMap   -    create  -       reconcile  -   -
^             babel-frontend                 Deployment  60d  update  -       reconcile  ok  -
^             gru-home                       Deployment  6d   update  -       reconcile  ok  -
babel-tenant  babel-toolbox                  Service     60d  update  -       reconcile  ok  -

Op:      1 create, 1 delete, 7 update, 0 noop, 0 exists
Wait to: 8 reconcile, 1 delete, 0 noop

11:59:54AM: ---- applying 2 changes [0/9 done] ----
11:59:54AM: delete configmap/babel-entrypoint-config-ver-1 (v1) namespace: babel-system
11:59:54AM: create configmap/babel-entrypoint-config-ver-7 (v1) namespace: babel-system
11:59:54AM: ---- waiting on 2 changes [0/9 done] ----
11:59:54AM: ok: delete configmap/babel-entrypoint-config-ver-1 (v1) namespace: babel-system
11:59:54AM: ok: reconcile configmap/babel-entrypoint-config-ver-7 (v1) namespace: babel-system
11:59:54AM: ---- applying 4 changes [2/9 done] ----
11:59:54AM: update deployment/gru-home (apps/v1) namespace: babel-system
11:59:54AM: update service/babel-toolbox (v1) namespace: babel-tenant
11:59:54AM: update deployment/babel-ai-proxy (apps/v1) namespace: babel-system
11:59:54AM: update deployment/babel-entrypoint (apps/v1) namespace: babel-system
11:59:54AM: ---- waiting on 4 changes [2/9 done] ----
11:59:54AM: ok: reconcile service/babel-toolbox (v1) namespace: babel-tenant
11:59:54AM: ongoing: reconcile deployment/gru-home (apps/v1) namespace: babel-system
11:59:54AM:  ^ Waiting for generation 4 to be observed
11:59:54AM:  L ok: waiting on replicaset/gru-home-7f777f9b76 (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/gru-home-55cb8b7b9c (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on pod/gru-home-7f777f9b76-qgspf (v1) namespace: babel-system
11:59:54AM:  L ongoing: waiting on pod/gru-home-55cb8b7b9c-xr25j (v1) namespace: babel-system
11:59:54AM:     ^ Pending
11:59:54AM: ongoing: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
11:59:54AM:  ^ Waiting for generation 19 to be observed
11:59:54AM:  L ok: waiting on replicaset/babel-ai-proxy-f77d895f (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-ai-proxy-f4fb44f78 (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-ai-proxy-cdbf94b64 (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-ai-proxy-c4bbf9b54 (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-ai-proxy-847ffd96f4 (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-ai-proxy-778f85595 (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-ai-proxy-6fcc94545d (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-ai-proxy-6fc98f56f9 (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-ai-proxy-664879578b (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-ai-proxy-657cbdcdf9 (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-ai-proxy-64fd6dc7c8 (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on pod/babel-ai-proxy-f77d895f-64cxt (v1) namespace: babel-system
11:59:54AM:  L ongoing: waiting on pod/babel-ai-proxy-778f85595-g6grd (v1) namespace: babel-system
11:59:54AM:     ^ Pending
11:59:54AM: ongoing: reconcile deployment/babel-entrypoint (apps/v1) namespace: babel-system
11:59:54AM:  ^ Waiting for generation 14 to be observed
11:59:54AM:  L ok: waiting on replicaset/babel-entrypoint-fc87b9c85 (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-entrypoint-df6ff574c (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-entrypoint-b945d86b6 (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-entrypoint-7d9589679b (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-entrypoint-676744787b (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-entrypoint-66cdf859f6 (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-entrypoint-6488fbb7dd (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on pod/babel-entrypoint-7d9589679b-2kxpj (v1) namespace: babel-system
11:59:54AM:  L ongoing: waiting on pod/babel-entrypoint-66cdf859f6-vnhgl (v1) namespace: babel-system
11:59:54AM:     ^ Pending
11:59:54AM: ---- waiting on 3 changes [3/9 done] ----
11:59:54AM: ongoing: reconcile deployment/gru-home (apps/v1) namespace: babel-system
11:59:54AM:  ^ Waiting for 1 unavailable replicas
11:59:54AM:  L ok: waiting on replicaset/gru-home-7f777f9b76 (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/gru-home-55cb8b7b9c (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on pod/gru-home-7f777f9b76-qgspf (v1) namespace: babel-system
11:59:54AM:  L ongoing: waiting on pod/gru-home-55cb8b7b9c-xr25j (v1) namespace: babel-system
11:59:54AM:     ^ Pending: ContainerCreating
11:59:54AM: ongoing: reconcile deployment/babel-entrypoint (apps/v1) namespace: babel-system
11:59:54AM:  ^ Waiting for generation 14 to be observed
11:59:54AM:  L ok: waiting on replicaset/babel-entrypoint-fc87b9c85 (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-entrypoint-df6ff574c (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-entrypoint-b945d86b6 (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-entrypoint-7d9589679b (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-entrypoint-676744787b (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-entrypoint-66cdf859f6 (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on replicaset/babel-entrypoint-6488fbb7dd (apps/v1) namespace: babel-system
11:59:54AM:  L ok: waiting on pod/babel-entrypoint-7d9589679b-2kxpj (v1) namespace: babel-system
11:59:54AM:  L ongoing: waiting on pod/babel-entrypoint-66cdf859f6-vnhgl (v1) namespace: babel-system
11:59:54AM:     ^ Pending: ContainerCreating
11:59:57AM: ongoing: reconcile deployment/gru-home (apps/v1) namespace: babel-system
11:59:57AM:  ^ Waiting for 1 unavailable replicas
11:59:57AM:  L ok: waiting on replicaset/gru-home-7f777f9b76 (apps/v1) namespace: babel-system
11:59:57AM:  L ok: waiting on replicaset/gru-home-55cb8b7b9c (apps/v1) namespace: babel-system
11:59:57AM:  L ok: waiting on pod/gru-home-7f777f9b76-qgspf (v1) namespace: babel-system
11:59:57AM:  L ongoing: waiting on pod/gru-home-55cb8b7b9c-xr25j (v1) namespace: babel-system
11:59:57AM:     ^ Condition Ready is not True (False)
11:59:57AM: ok: reconcile deployment/babel-entrypoint (apps/v1) namespace: babel-system
11:59:57AM: ongoing: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
11:59:57AM:  ^ Waiting for 1 unavailable replicas
11:59:57AM:  L ok: waiting on replicaset/babel-ai-proxy-f77d895f (apps/v1) namespace: babel-system
11:59:57AM:  L ok: waiting on replicaset/babel-ai-proxy-f4fb44f78 (apps/v1) namespace: babel-system
11:59:57AM:  L ok: waiting on replicaset/babel-ai-proxy-cdbf94b64 (apps/v1) namespace: babel-system
11:59:57AM:  L ok: waiting on replicaset/babel-ai-proxy-c4bbf9b54 (apps/v1) namespace: babel-system
11:59:57AM:  L ok: waiting on replicaset/babel-ai-proxy-847ffd96f4 (apps/v1) namespace: babel-system
11:59:57AM:  L ok: waiting on replicaset/babel-ai-proxy-778f85595 (apps/v1) namespace: babel-system
11:59:57AM:  L ok: waiting on replicaset/babel-ai-proxy-6fcc94545d (apps/v1) namespace: babel-system
11:59:57AM:  L ok: waiting on replicaset/babel-ai-proxy-6fc98f56f9 (apps/v1) namespace: babel-system
11:59:57AM:  L ok: waiting on replicaset/babel-ai-proxy-664879578b (apps/v1) namespace: babel-system
11:59:57AM:  L ok: waiting on replicaset/babel-ai-proxy-657cbdcdf9 (apps/v1) namespace: babel-system
11:59:57AM:  L ok: waiting on replicaset/babel-ai-proxy-64fd6dc7c8 (apps/v1) namespace: babel-system
11:59:57AM:  L ok: waiting on pod/babel-ai-proxy-f77d895f-64cxt (v1) namespace: babel-system
11:59:57AM:  L ongoing: waiting on pod/babel-ai-proxy-778f85595-g6grd (v1) namespace: babel-system
11:59:57AM:     ^ Condition Ready is not True (False)
11:59:57AM: ---- waiting on 2 changes [4/9 done] ----
12:00:06PM: ok: reconcile deployment/gru-home (apps/v1) namespace: babel-system
12:00:06PM: ok: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
12:00:06PM: ---- applying 1 changes [6/9 done] ----
12:00:07PM: update deployment/babel-agent (apps/v1) namespace: babel-system
12:00:07PM: ---- waiting on 1 changes [6/9 done] ----
12:00:07PM: ongoing: reconcile deployment/babel-agent (apps/v1) namespace: babel-system
12:00:07PM:  ^ Waiting for generation 51 to be observed
12:00:07PM:  L ok: waiting on replicaset/babel-agent-85b7978cb7 (apps/v1) namespace: babel-system
12:00:07PM:  L ok: waiting on replicaset/babel-agent-845dcc76db (apps/v1) namespace: babel-system
12:00:07PM:  L ok: waiting on replicaset/babel-agent-7cbdbbc696 (apps/v1) namespace: babel-system
12:00:07PM:  L ok: waiting on replicaset/babel-agent-74dcf895f5 (apps/v1) namespace: babel-system
12:00:07PM:  L ok: waiting on replicaset/babel-agent-6f8b64c7fb (apps/v1) namespace: babel-system
12:00:07PM:  L ok: waiting on replicaset/babel-agent-6c5bb948dc (apps/v1) namespace: babel-system
12:00:07PM:  L ok: waiting on replicaset/babel-agent-64fb48c56 (apps/v1) namespace: babel-system
12:00:07PM:  L ok: waiting on replicaset/babel-agent-5ddff6c776 (apps/v1) namespace: babel-system
12:00:07PM:  L ok: waiting on replicaset/babel-agent-5cccb887bc (apps/v1) namespace: babel-system
12:00:07PM:  L ok: waiting on replicaset/babel-agent-56dfb9dffc (apps/v1) namespace: babel-system
12:00:07PM:  L ok: waiting on replicaset/babel-agent-545b76cf8f (apps/v1) namespace: babel-system
12:00:10PM: ok: reconcile deployment/babel-agent (apps/v1) namespace: babel-system
12:00:10PM: ---- applying 1 changes [7/9 done] ----
12:00:10PM: update deployment/babel-controller (apps/v1) namespace: babel-system
12:00:10PM: ---- waiting on 1 changes [7/9 done] ----
12:00:10PM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
12:00:10PM:  ^ Waiting for generation 53 to be observed
12:00:10PM:  L ok: waiting on replicaset/babel-controller-df4ff8846 (apps/v1) namespace: babel-system
12:00:10PM:  L ok: waiting on replicaset/babel-controller-cc449bbd4 (apps/v1) namespace: babel-system
12:00:10PM:  L ok: waiting on replicaset/babel-controller-8565b956f7 (apps/v1) namespace: babel-system
12:00:10PM:  L ok: waiting on replicaset/babel-controller-84b594bb8 (apps/v1) namespace: babel-system
12:00:10PM:  L ok: waiting on replicaset/babel-controller-7c94559b9f (apps/v1) namespace: babel-system
12:00:10PM:  L ok: waiting on replicaset/babel-controller-74dd56977 (apps/v1) namespace: babel-system
12:00:10PM:  L ok: waiting on replicaset/babel-controller-747bfc57f6 (apps/v1) namespace: babel-system
12:00:10PM:  L ok: waiting on replicaset/babel-controller-6f4d79dbb6 (apps/v1) namespace: babel-system
12:00:10PM:  L ok: waiting on replicaset/babel-controller-6b5fb485bc (apps/v1) namespace: babel-system
12:00:10PM:  L ok: waiting on replicaset/babel-controller-6789b45f9d (apps/v1) namespace: babel-system
12:00:10PM:  L ok: waiting on replicaset/babel-controller-5dd8f4596c (apps/v1) namespace: babel-system
12:00:10PM:  L ok: waiting on replicaset/babel-controller-57689d8957 (apps/v1) namespace: babel-system
12:00:10PM:  L ok: waiting on pod/babel-controller-6b5fb485bc-cgv5g (v1) namespace: babel-system
12:00:10PM:  L ongoing: waiting on pod/babel-controller-6789b45f9d-c82vj (v1) namespace: babel-system
12:00:10PM:     ^ Pending
12:00:13PM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
12:00:13PM:  ^ Waiting for 1 unavailable replicas
12:00:13PM:  L ok: waiting on replicaset/babel-controller-df4ff8846 (apps/v1) namespace: babel-system
12:00:13PM:  L ok: waiting on replicaset/babel-controller-cc449bbd4 (apps/v1) namespace: babel-system
12:00:13PM:  L ok: waiting on replicaset/babel-controller-8565b956f7 (apps/v1) namespace: babel-system
12:00:13PM:  L ok: waiting on replicaset/babel-controller-84b594bb8 (apps/v1) namespace: babel-system
12:00:13PM:  L ok: waiting on replicaset/babel-controller-7c94559b9f (apps/v1) namespace: babel-system
12:00:13PM:  L ok: waiting on replicaset/babel-controller-74dd56977 (apps/v1) namespace: babel-system
12:00:13PM:  L ok: waiting on replicaset/babel-controller-747bfc57f6 (apps/v1) namespace: babel-system
12:00:13PM:  L ok: waiting on replicaset/babel-controller-6f4d79dbb6 (apps/v1) namespace: babel-system
12:00:13PM:  L ok: waiting on replicaset/babel-controller-6b5fb485bc (apps/v1) namespace: babel-system
12:00:13PM:  L ok: waiting on replicaset/babel-controller-6789b45f9d (apps/v1) namespace: babel-system
12:00:13PM:  L ok: waiting on replicaset/babel-controller-5dd8f4596c (apps/v1) namespace: babel-system
12:00:13PM:  L ok: waiting on replicaset/babel-controller-57689d8957 (apps/v1) namespace: babel-system
12:00:13PM:  L ok: waiting on pod/babel-controller-6b5fb485bc-cgv5g (v1) namespace: babel-system
12:00:13PM:  L ongoing: waiting on pod/babel-controller-6789b45f9d-c82vj (v1) namespace: babel-system
12:00:13PM:     ^ Condition Ready is not True (False)
12:00:40PM: ok: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
12:00:40PM: ---- applying 1 changes [8/9 done] ----
12:00:40PM: update deployment/babel-frontend (apps/v1) namespace: babel-system
12:00:40PM: ---- waiting on 1 changes [8/9 done] ----
12:00:40PM: ongoing: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
12:00:40PM:  ^ Waiting for generation 40 to be observed
12:00:40PM:  L ok: waiting on replicaset/babel-frontend-fcb7c87dd (apps/v1) namespace: babel-system
12:00:40PM:  L ok: waiting on replicaset/babel-frontend-c9fcf49f5 (apps/v1) namespace: babel-system
12:00:40PM:  L ok: waiting on replicaset/babel-frontend-b68f7cf9b (apps/v1) namespace: babel-system
12:00:40PM:  L ok: waiting on replicaset/babel-frontend-767cc84cfd (apps/v1) namespace: babel-system
12:00:40PM:  L ok: waiting on replicaset/babel-frontend-6446bdfffd (apps/v1) namespace: babel-system
12:00:40PM:  L ok: waiting on replicaset/babel-frontend-5ff48b84b4 (apps/v1) namespace: babel-system
12:00:40PM:  L ok: waiting on replicaset/babel-frontend-5f78c5ffbf (apps/v1) namespace: babel-system
12:00:40PM:  L ok: waiting on replicaset/babel-frontend-5cc79b84d7 (apps/v1) namespace: babel-system
12:00:40PM:  L ok: waiting on replicaset/babel-frontend-59cd84567d (apps/v1) namespace: babel-system
12:00:40PM:  L ok: waiting on replicaset/babel-frontend-59485bc9d9 (apps/v1) namespace: babel-system
12:00:40PM:  L ok: waiting on replicaset/babel-frontend-5864b55844 (apps/v1) namespace: babel-system
12:00:40PM:  L ok: waiting on replicaset/babel-frontend-555cb8f5b6 (apps/v1) namespace: babel-system
12:00:40PM:  L ok: waiting on pod/babel-frontend-767cc84cfd-drzfr (v1) namespace: babel-system
12:00:43PM: ongoing: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
12:00:43PM:  ^ Waiting for 1 unavailable replicas
12:00:43PM:  L ok: waiting on replicaset/babel-frontend-fcb7c87dd (apps/v1) namespace: babel-system
12:00:43PM:  L ok: waiting on replicaset/babel-frontend-c9fcf49f5 (apps/v1) namespace: babel-system
12:00:43PM:  L ok: waiting on replicaset/babel-frontend-b68f7cf9b (apps/v1) namespace: babel-system
12:00:43PM:  L ok: waiting on replicaset/babel-frontend-767cc84cfd (apps/v1) namespace: babel-system
12:00:43PM:  L ok: waiting on replicaset/babel-frontend-6446bdfffd (apps/v1) namespace: babel-system
12:00:43PM:  L ok: waiting on replicaset/babel-frontend-5ff48b84b4 (apps/v1) namespace: babel-system
12:00:43PM:  L ok: waiting on replicaset/babel-frontend-5f78c5ffbf (apps/v1) namespace: babel-system
12:00:43PM:  L ok: waiting on replicaset/babel-frontend-5cc79b84d7 (apps/v1) namespace: babel-system
12:00:43PM:  L ok: waiting on replicaset/babel-frontend-59cd84567d (apps/v1) namespace: babel-system
12:00:43PM:  L ok: waiting on replicaset/babel-frontend-59485bc9d9 (apps/v1) namespace: babel-system
12:00:43PM:  L ok: waiting on replicaset/babel-frontend-5864b55844 (apps/v1) namespace: babel-system
12:00:43PM:  L ok: waiting on replicaset/babel-frontend-555cb8f5b6 (apps/v1) namespace: babel-system
12:00:43PM:  L ok: waiting on pod/babel-frontend-767cc84cfd-drzfr (v1) namespace: babel-system
12:00:43PM:  L ongoing: waiting on pod/babel-frontend-5f78c5ffbf-wz44p (v1) namespace: babel-system
12:00:43PM:     ^ Condition Ready is not True (False)
12:00:52PM: ok: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
12:00:52PM: ---- applying complete [9/9 done] ----
12:00:52PM: ---- waiting complete [9/9 done] ----

Succeeded
Deleted: ghcr.io/babelcloud/babel-ai-proxy:df356c1
 ➜ Setup port forwarding...
Force restart or not running process found, clean-up kwt-net pod...
Clean-up krelay-server pod...
No proxy needed, you are outside the wall.
Stopping `supervisor`... (might take a while)
==> Successfully stopped `supervisor` (label: homebrew.mxcl.supervisor)
 ✔ Port forwarding completed, elapsed 7.465s
 ✔ Installed Babel App, elapsed 3m 24s
git pull
remote: Enumerating objects: 36, done.
remote: Counting objects: 100% (36/36), done.
remote: Compressing objects: 100% (25/25), done.
remote: Total 36 (delta 15), reused 28 (delta 11), pack-reused 0 (from 0)
Unpacking objects: 100% (36/36), 11.70 KiB | 921.00 KiB/s, done.
From github.com:babelcloud/babel-umbrella
   37e4da4..e80acee  main       -> origin/main
Fetching submodule agent
From github.com:babelcloud/babel-agent
 * [new branch]      cxz/feat/probot -> origin/cxz/feat/probot
   3f6b6b1..bb81845  main            -> origin/main
 * [new branch]      mingshun/ops/update-swe-rag-endpoint -> origin/mingshun/ops/update-swe-rag-endpoint
 * [new branch]      vangie/remove-useless-convertToDate -> origin/vangie/remove-useless-convertToDate
 * [new branch]      vitester-src-utils-stringify-ts -> origin/vitester-src-utils-stringify-ts
Fetching submodule frontend
From github.com:babelcloud/babel-frontend
   527d1077..7214d7c9  main       -> origin/main
Updating 37e4da4..e80acee
Fast-forward
 agent                                                   |  2 +-
 deploy/init/swe-bench-rag/.gitignore                    |  5 +++++
 deploy/init/swe-bench-rag/.terraform.lock.hcl           | 79 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 deploy/init/swe-bench-rag/README.md                     | 18 ++++++++++++++++++
 deploy/init/swe-bench-rag/cloud-function.tf             | 72 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 deploy/init/swe-bench-rag/code/index.js                 | 92 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 deploy/init/swe-bench-rag/code/package.json             |  8 ++++++++
 deploy/init/swe-bench-rag/input.tf                      | 19 +++++++++++++++++++
 deploy/init/swe-bench-rag/main.tf                       | 24 ++++++++++++++++++++++++
 deploy/init/swe-bench-rag/postgres.tf                   | 43 +++++++++++++++++++++++++++++++++++++++++++
 deploy/local/scripts/install-cluster.sh                 | 43 +++++++++++++++++++++++++++++++++++++++++--
 deploy/local/scripts/preload-image/image-list.arm64.txt |  2 ++
 frontend                                                |  2 +-
 13 files changed, 405 insertions(+), 4 deletions(-)
 create mode 100644 deploy/init/swe-bench-rag/.gitignore
 create mode 100644 deploy/init/swe-bench-rag/.terraform.lock.hcl
 create mode 100644 deploy/init/swe-bench-rag/README.md
 create mode 100644 deploy/init/swe-bench-rag/cloud-function.tf
 create mode 100644 deploy/init/swe-bench-rag/code/index.js
 create mode 100644 deploy/init/swe-bench-rag/code/package.json
 create mode 100644 deploy/init/swe-bench-rag/input.tf
 create mode 100644 deploy/init/swe-bench-rag/main.tf
 create mode 100644 deploy/init/swe-bench-rag/postgres.tf
git submodule update
Submodule path 'agent': checked out '5dcf4b9408666f76cc18adb0b7f2c20c1f89658d'
Submodule path 'frontend': checked out '7214d7c9d7b82f4b4961c980e20f6f3e28cb7b3c'
make install-app
Services run locally: frontend,agent

 ✔ Preload service images, elapsed 0.567s
Target cluster 'https://0.0.0.0:40180' (nodes: babelcloud-control-plane)

@@ update deployment/babel-agent (apps/v1) namespace: babel-system @@
  ...
690,690                 name: babel-infra-secret
691     -         image: ghcr.io/babelcloud/babel-agent:3f6b6b1
    691 +         image: ghcr.io/babelcloud/babel-agent:5dcf4b9
692,692           imagePullPolicy: IfNotPresent
693,693           livenessProbe:
@@ update deployment/babel-controller (apps/v1) namespace: babel-system @@
  ...
535,535           - name: BABELCLOUD_REVISION
536     -           value: 37e4da4b0349ca53f0d0e7df8b198a83a4f40636
    536 +           value: e80aceeafa88f999f34863a8a0877889a1770229
537,537           - name: BABELCLOUD_ENVIRONMENT
538,538             valueFrom:
@@ update deployment/babel-frontend (apps/v1) namespace: babel-system @@
  ...
162,162                 name: babel-infra-config
163     -         image: ghcr.io/babelcloud/babel-frontend:527d107
    163 +         image: ghcr.io/babelcloud/babel-frontend:7214d7c
164,164           imagePullPolicy: IfNotPresent
165,165           livenessProbe:
@@ update service/babel-toolbox (v1) namespace: babel-tenant @@
  ...
  2,  2   metadata:
  3     -   annotations: {}
  4,  3     creationTimestamp: "2024-07-20T15:48:28Z"
  5,  4     labels:
  ...
 54, 53     clusterIP: 10.96.141.65
 55     -   clusterIPs:
 56     -   - 10.96.141.65
 57     -   internalTrafficPolicy: Cluster
 58     -   ipFamilies:
 59     -   - IPv4
 60     -   ipFamilyPolicy: SingleStack
 61, 54     ports:
 62     -   - name: port0
 63     -     port: 3010
 64     -     protocol: TCP
 65     -     targetPort: 42407
     55 +   - port: 3010
 66, 56     selector:
 67     -     kwt.cppforlife.com/net: "true"
 68     -   sessionAffinity: None
     57 +     kapp.k14s.io/app: "1721490507501923000"
     58 +     module: babel-toolbox
 69, 59     type: ClusterIP
 70, 60

Changes

Namespace     Name              Kind        Age  Op      Op st.  Wait to    Rs  Ri
babel-system  babel-agent       Deployment  63d  update  -       reconcile  ok  -
^             babel-controller  Deployment  63d  update  -       reconcile  ok  -
^             babel-frontend    Deployment  63d  update  -       reconcile  ok  -
babel-tenant  babel-toolbox     Service     63d  update  -       reconcile  ok  -

Op:      0 create, 0 delete, 4 update, 0 noop, 0 exists
Wait to: 4 reconcile, 0 delete, 0 noop

10:40:59AM: ---- applying 2 changes [0/4 done] ----
10:40:59AM: update service/babel-toolbox (v1) namespace: babel-tenant
10:40:59AM: update deployment/babel-agent (apps/v1) namespace: babel-system
10:40:59AM: ---- waiting on 2 changes [0/4 done] ----
10:40:59AM: ok: reconcile service/babel-toolbox (v1) namespace: babel-tenant
10:40:59AM: ongoing: reconcile deployment/babel-agent (apps/v1) namespace: babel-system
10:40:59AM:  ^ Waiting for generation 56 to be observed
10:40:59AM:  L ok: waiting on replicaset/babel-agent-85b7978cb7 (apps/v1) namespace: babel-system
10:40:59AM:  L ok: waiting on replicaset/babel-agent-85b4578ddd (apps/v1) namespace: babel-system
10:40:59AM:  L ok: waiting on replicaset/babel-agent-845dcc76db (apps/v1) namespace: babel-system
10:40:59AM:  L ok: waiting on replicaset/babel-agent-7cbdbbc696 (apps/v1) namespace: babel-system
10:40:59AM:  L ok: waiting on replicaset/babel-agent-764ddb747f (apps/v1) namespace: babel-system
10:40:59AM:  L ok: waiting on replicaset/babel-agent-6f8b64c7fb (apps/v1) namespace: babel-system
10:40:59AM:  L ok: waiting on replicaset/babel-agent-6c5bb948dc (apps/v1) namespace: babel-system
10:40:59AM:  L ok: waiting on replicaset/babel-agent-64fb48c56 (apps/v1) namespace: babel-system
10:40:59AM:  L ok: waiting on replicaset/babel-agent-5ddff6c776 (apps/v1) namespace: babel-system
10:40:59AM:  L ok: waiting on replicaset/babel-agent-5cccb887bc (apps/v1) namespace: babel-system
10:40:59AM:  L ok: waiting on replicaset/babel-agent-56dfb9dffc (apps/v1) namespace: babel-system
10:40:59AM:  L ok: waiting on replicaset/babel-agent-545b76cf8f (apps/v1) namespace: babel-system
10:40:59AM: ---- waiting on 1 changes [1/4 done] ----
10:41:02AM: ok: reconcile deployment/babel-agent (apps/v1) namespace: babel-system
10:41:02AM: ---- applying 1 changes [2/4 done] ----
10:41:03AM: update deployment/babel-controller (apps/v1) namespace: babel-system
10:41:03AM: ---- waiting on 1 changes [2/4 done] ----
10:41:03AM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
10:41:03AM:  ^ Waiting for generation 58 to be observed
10:41:03AM:  L ok: waiting on replicaset/babel-controller-df4ff8846 (apps/v1) namespace: babel-system
10:41:03AM:  L ok: waiting on replicaset/babel-controller-cb646cbdd (apps/v1) namespace: babel-system
10:41:03AM:  L ok: waiting on replicaset/babel-controller-8565b956f7 (apps/v1) namespace: babel-system
10:41:03AM:  L ok: waiting on replicaset/babel-controller-84b594bb8 (apps/v1) namespace: babel-system
10:41:03AM:  L ok: waiting on replicaset/babel-controller-7f4678b6 (apps/v1) namespace: babel-system
10:41:03AM:  L ok: waiting on replicaset/babel-controller-7c66594978 (apps/v1) namespace: babel-system
10:41:03AM:  L ok: waiting on replicaset/babel-controller-74dd56977 (apps/v1) namespace: babel-system
10:41:03AM:  L ok: waiting on replicaset/babel-controller-747bfc57f6 (apps/v1) namespace: babel-system
10:41:03AM:  L ok: waiting on replicaset/babel-controller-6f4d79dbb6 (apps/v1) namespace: babel-system
10:41:03AM:  L ok: waiting on replicaset/babel-controller-6b5fb485bc (apps/v1) namespace: babel-system
10:41:03AM:  L ok: waiting on replicaset/babel-controller-6789b45f9d (apps/v1) namespace: babel-system
10:41:03AM:  L ok: waiting on replicaset/babel-controller-5dd8f4596c (apps/v1) namespace: babel-system
10:41:03AM:  L ok: waiting on pod/babel-controller-cb646cbdd-vsngx (v1) namespace: babel-system
10:41:03AM:  L ongoing: waiting on pod/babel-controller-7f4678b6-vg686 (v1) namespace: babel-system
10:41:03AM:     ^ Pending: PodInitializing
10:41:06AM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
10:41:06AM:  ^ Waiting for 1 unavailable replicas
10:41:06AM:  L ok: waiting on replicaset/babel-controller-df4ff8846 (apps/v1) namespace: babel-system
10:41:06AM:  L ok: waiting on replicaset/babel-controller-cb646cbdd (apps/v1) namespace: babel-system
10:41:06AM:  L ok: waiting on replicaset/babel-controller-8565b956f7 (apps/v1) namespace: babel-system
10:41:06AM:  L ok: waiting on replicaset/babel-controller-84b594bb8 (apps/v1) namespace: babel-system
10:41:06AM:  L ok: waiting on replicaset/babel-controller-7f4678b6 (apps/v1) namespace: babel-system
10:41:06AM:  L ok: waiting on replicaset/babel-controller-7c66594978 (apps/v1) namespace: babel-system
10:41:06AM:  L ok: waiting on replicaset/babel-controller-74dd56977 (apps/v1) namespace: babel-system
10:41:06AM:  L ok: waiting on replicaset/babel-controller-747bfc57f6 (apps/v1) namespace: babel-system
10:41:06AM:  L ok: waiting on replicaset/babel-controller-6f4d79dbb6 (apps/v1) namespace: babel-system
10:41:06AM:  L ok: waiting on replicaset/babel-controller-6b5fb485bc (apps/v1) namespace: babel-system
10:41:06AM:  L ok: waiting on replicaset/babel-controller-6789b45f9d (apps/v1) namespace: babel-system
10:41:06AM:  L ok: waiting on replicaset/babel-controller-5dd8f4596c (apps/v1) namespace: babel-system
10:41:06AM:  L ok: waiting on pod/babel-controller-cb646cbdd-vsngx (v1) namespace: babel-system
10:41:06AM:  L ongoing: waiting on pod/babel-controller-7f4678b6-vg686 (v1) namespace: babel-system
10:41:06AM:     ^ Condition Ready is not True (False)
10:41:33AM: ok: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
10:41:33AM: ---- applying 1 changes [3/4 done] ----
10:41:33AM: update deployment/babel-frontend (apps/v1) namespace: babel-system
10:41:33AM: ---- waiting on 1 changes [3/4 done] ----
10:41:33AM: ongoing: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
10:41:33AM:  ^ Waiting for generation 44 to be observed
10:41:33AM:  L ok: waiting on replicaset/babel-frontend-fcb7c87dd (apps/v1) namespace: babel-system
10:41:33AM:  L ok: waiting on replicaset/babel-frontend-c9fcf49f5 (apps/v1) namespace: babel-system
10:41:33AM:  L ok: waiting on replicaset/babel-frontend-b68f7cf9b (apps/v1) namespace: babel-system
10:41:33AM:  L ok: waiting on replicaset/babel-frontend-767cc84cfd (apps/v1) namespace: babel-system
10:41:33AM:  L ok: waiting on replicaset/babel-frontend-6446bdfffd (apps/v1) namespace: babel-system
10:41:33AM:  L ok: waiting on replicaset/babel-frontend-5ff48b84b4 (apps/v1) namespace: babel-system
10:41:33AM:  L ok: waiting on replicaset/babel-frontend-5f78c5ffbf (apps/v1) namespace: babel-system
10:41:33AM:  L ok: waiting on replicaset/babel-frontend-5cc79b84d7 (apps/v1) namespace: babel-system
10:41:33AM:  L ok: waiting on replicaset/babel-frontend-59cd84567d (apps/v1) namespace: babel-system
10:41:33AM:  L ok: waiting on replicaset/babel-frontend-59485bc9d9 (apps/v1) namespace: babel-system
10:41:33AM:  L ok: waiting on replicaset/babel-frontend-5864b55844 (apps/v1) namespace: babel-system
10:41:33AM:  L ok: waiting on replicaset/babel-frontend-5454d6449c (apps/v1) namespace: babel-system
10:41:36AM: ok: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
10:41:36AM: ---- applying complete [4/4 done] ----
10:41:36AM: ---- waiting complete [4/4 done] ----

 ➜ Setup port forwarding...
Force restart or not running process found, clean-up kwt-net pod...
Clean-up krelay-server pod...
No proxy needed, you are outside the wall.
Stopping `supervisor`... (might take a while)
==> Successfully stopped `supervisor` (label: homebrew.mxcl.supervisor)
 ✔ Port forwarding completed, elapsed 9.895s
 ✔ Installed Babel App, elapsed 52.305s
make install-app
Services run locally: agent

 ➜ Preload service images...
 ✔ Preload service images, elapsed 1m 30s
Target cluster 'https://0.0.0.0:40180' (nodes: babelcloud-control-plane)

@@ update deployment/babel-controller (apps/v1) namespace: babel-system @@
  ...
622,622           - name: BABELCLOUD_FRONTEND_HOST
623     -           value: babel-frontend-local
    623 +           value: babel-frontend
624,624           - name: BABELCLOUD_HOME_HOST
625,625             value: babel-home
@@ update deployment/babel-entrypoint (apps/v1) namespace: babel-system @@
  ...
242,242           - name: FRONTEND_ENDPOINT
243     -           value: babel-frontend-local.babel-system.svc.cluster.local:3001
    243 +           value: babel-frontend.babel-system.svc.cluster.local:3001
244,244           - name: HOME_ENDPOINT
245,245             value: babel-home.babel-system.svc.cluster.local:3002
@@ update deployment/babel-frontend (apps/v1) namespace: babel-system @@
  ...
141,141   spec:
142     -   replicas: 0
    142 +   replicas: 1
143,143     selector:
144,144       matchLabels:
@@ update service/babel-toolbox (v1) namespace: babel-tenant @@
  ...
  2,  2   metadata:
  3     -   annotations: {}
  4,  3     creationTimestamp: "2024-07-20T15:48:28Z"
  5,  4     labels:
  ...
 54, 53     clusterIP: 10.96.141.65
 55     -   clusterIPs:
 56     -   - 10.96.141.65
 57     -   internalTrafficPolicy: Cluster
 58     -   ipFamilies:
 59     -   - IPv4
 60     -   ipFamilyPolicy: SingleStack
 61, 54     ports:
 62     -   - name: port0
 63     -     port: 3010
 64     -     protocol: TCP
 65     -     targetPort: 35813
     55 +   - port: 3010
 66, 56     selector:
 67     -     kwt.cppforlife.com/net: "true"
 68     -   sessionAffinity: None
     57 +     kapp.k14s.io/app: "1721490507501923000"
     58 +     module: babel-toolbox
 69, 59     type: ClusterIP
 70, 60

Changes

Namespace     Name              Kind        Age  Op      Op st.  Wait to    Rs  Ri
babel-system  babel-controller  Deployment  63d  update  -       reconcile  ok  -
^             babel-entrypoint  Deployment  63d  update  -       reconcile  ok  -
^             babel-frontend    Deployment  63d  update  -       reconcile  ok  -
babel-tenant  babel-toolbox     Service     63d  update  -       reconcile  ok  -

Op:      0 create, 0 delete, 4 update, 0 noop, 0 exists
Wait to: 4 reconcile, 0 delete, 0 noop

11:06:13AM: ---- applying 2 changes [0/4 done] ----
11:06:13AM: update service/babel-toolbox (v1) namespace: babel-tenant
11:06:13AM: update deployment/babel-entrypoint (apps/v1) namespace: babel-system
11:06:13AM: ---- waiting on 2 changes [0/4 done] ----
11:06:13AM: ok: reconcile service/babel-toolbox (v1) namespace: babel-tenant
11:06:13AM: ongoing: reconcile deployment/babel-entrypoint (apps/v1) namespace: babel-system
11:06:13AM:  ^ Waiting for generation 18 to be observed
11:06:13AM:  L ok: waiting on replicaset/babel-entrypoint-fc87b9c85 (apps/v1) namespace: babel-system
11:06:13AM:  L ok: waiting on replicaset/babel-entrypoint-df6ff574c (apps/v1) namespace: babel-system
11:06:13AM:  L ok: waiting on replicaset/babel-entrypoint-b945d86b6 (apps/v1) namespace: babel-system
11:06:13AM:  L ok: waiting on replicaset/babel-entrypoint-7d9589679b (apps/v1) namespace: babel-system
11:06:13AM:  L ok: waiting on replicaset/babel-entrypoint-676744787b (apps/v1) namespace: babel-system
11:06:13AM:  L ok: waiting on replicaset/babel-entrypoint-66cdf859f6 (apps/v1) namespace: babel-system
11:06:13AM:  L ok: waiting on replicaset/babel-entrypoint-6488fbb7dd (apps/v1) namespace: babel-system
11:06:13AM:  L ok: waiting on replicaset/babel-entrypoint-5f955c8f86 (apps/v1) namespace: babel-system
11:06:13AM:  L ok: waiting on pod/babel-entrypoint-5f955c8f86-sb7m8 (v1) namespace: babel-system
11:06:13AM: ---- waiting on 1 changes [1/4 done] ----
11:06:13AM: ongoing: reconcile deployment/babel-entrypoint (apps/v1) namespace: babel-system
11:06:13AM:  ^ Waiting for 1 unavailable replicas
11:06:13AM:  L ok: waiting on replicaset/babel-entrypoint-fc87b9c85 (apps/v1) namespace: babel-system
11:06:13AM:  L ok: waiting on replicaset/babel-entrypoint-df6ff574c (apps/v1) namespace: babel-system
11:06:13AM:  L ok: waiting on replicaset/babel-entrypoint-b945d86b6 (apps/v1) namespace: babel-system
11:06:13AM:  L ok: waiting on replicaset/babel-entrypoint-7d9589679b (apps/v1) namespace: babel-system
11:06:13AM:  L ok: waiting on replicaset/babel-entrypoint-676744787b (apps/v1) namespace: babel-system
11:06:13AM:  L ok: waiting on replicaset/babel-entrypoint-66cdf859f6 (apps/v1) namespace: babel-system
11:06:13AM:  L ok: waiting on replicaset/babel-entrypoint-6488fbb7dd (apps/v1) namespace: babel-system
11:06:13AM:  L ok: waiting on replicaset/babel-entrypoint-5f955c8f86 (apps/v1) namespace: babel-system
11:06:13AM:  L ongoing: waiting on pod/babel-entrypoint-66cdf859f6-qdwp5 (v1) namespace: babel-system
11:06:13AM:     ^ Pending
11:06:13AM:  L ok: waiting on pod/babel-entrypoint-5f955c8f86-sb7m8 (v1) namespace: babel-system
11:06:16AM: ok: reconcile deployment/babel-entrypoint (apps/v1) namespace: babel-system
11:06:16AM: ---- applying 1 changes [2/4 done] ----
11:06:18AM: update deployment/babel-controller (apps/v1) namespace: babel-system
11:06:18AM: ---- waiting on 1 changes [2/4 done] ----
11:06:18AM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
11:06:18AM:  ^ Waiting for generation 60 to be observed
11:06:18AM:  L ok: waiting on replicaset/babel-controller-df4ff8846 (apps/v1) namespace: babel-system
11:06:18AM:  L ok: waiting on replicaset/babel-controller-cb646cbdd (apps/v1) namespace: babel-system
11:06:18AM:  L ok: waiting on replicaset/babel-controller-9bfb8787b (apps/v1) namespace: babel-system
11:06:18AM:  L ok: waiting on replicaset/babel-controller-8565b956f7 (apps/v1) namespace: babel-system
11:06:18AM:  L ok: waiting on replicaset/babel-controller-84b594bb8 (apps/v1) namespace: babel-system
11:06:18AM:  L ok: waiting on replicaset/babel-controller-7f4678b6 (apps/v1) namespace: babel-system
11:06:18AM:  L ok: waiting on replicaset/babel-controller-7c66594978 (apps/v1) namespace: babel-system
11:06:18AM:  L ok: waiting on replicaset/babel-controller-747bfc57f6 (apps/v1) namespace: babel-system
11:06:18AM:  L ok: waiting on replicaset/babel-controller-6f4d79dbb6 (apps/v1) namespace: babel-system
11:06:18AM:  L ok: waiting on replicaset/babel-controller-6b5fb485bc (apps/v1) namespace: babel-system
11:06:18AM:  L ok: waiting on replicaset/babel-controller-6789b45f9d (apps/v1) namespace: babel-system
11:06:18AM:  L ok: waiting on replicaset/babel-controller-5dd8f4596c (apps/v1) namespace: babel-system
11:06:18AM:  L ongoing: waiting on pod/babel-controller-9bfb8787b-f6mhh (v1) namespace: babel-system
11:06:18AM:     ^ Pending: PodInitializing
11:06:18AM:  L ok: waiting on pod/babel-controller-7f4678b6-vg686 (v1) namespace: babel-system
11:06:21AM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
11:06:21AM:  ^ Waiting for 1 unavailable replicas
11:06:21AM:  L ok: waiting on replicaset/babel-controller-df4ff8846 (apps/v1) namespace: babel-system
11:06:21AM:  L ok: waiting on replicaset/babel-controller-cb646cbdd (apps/v1) namespace: babel-system
11:06:21AM:  L ok: waiting on replicaset/babel-controller-9bfb8787b (apps/v1) namespace: babel-system
11:06:21AM:  L ok: waiting on replicaset/babel-controller-8565b956f7 (apps/v1) namespace: babel-system
11:06:21AM:  L ok: waiting on replicaset/babel-controller-84b594bb8 (apps/v1) namespace: babel-system
11:06:21AM:  L ok: waiting on replicaset/babel-controller-7f4678b6 (apps/v1) namespace: babel-system
11:06:21AM:  L ok: waiting on replicaset/babel-controller-7c66594978 (apps/v1) namespace: babel-system
11:06:21AM:  L ok: waiting on replicaset/babel-controller-747bfc57f6 (apps/v1) namespace: babel-system
11:06:21AM:  L ok: waiting on replicaset/babel-controller-6f4d79dbb6 (apps/v1) namespace: babel-system
11:06:21AM:  L ok: waiting on replicaset/babel-controller-6b5fb485bc (apps/v1) namespace: babel-system
11:06:21AM:  L ok: waiting on replicaset/babel-controller-6789b45f9d (apps/v1) namespace: babel-system
11:06:21AM:  L ok: waiting on replicaset/babel-controller-5dd8f4596c (apps/v1) namespace: babel-system
11:06:21AM:  L ongoing: waiting on pod/babel-controller-9bfb8787b-f6mhh (v1) namespace: babel-system
11:06:21AM:     ^ Condition Ready is not True (False)
11:06:21AM:  L ok: waiting on pod/babel-controller-7f4678b6-vg686 (v1) namespace: babel-system
11:06:39AM: ok: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
11:06:39AM: ---- applying 1 changes [3/4 done] ----
11:06:39AM: update deployment/babel-frontend (apps/v1) namespace: babel-system
11:06:39AM: ---- waiting on 1 changes [3/4 done] ----
11:06:39AM: ongoing: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
11:06:39AM:  ^ Waiting for generation 46 to be observed
11:06:39AM:  L ok: waiting on replicaset/babel-frontend-fcb7c87dd (apps/v1) namespace: babel-system
11:06:39AM:  L ok: waiting on replicaset/babel-frontend-c9fcf49f5 (apps/v1) namespace: babel-system
11:06:39AM:  L ok: waiting on replicaset/babel-frontend-b68f7cf9b (apps/v1) namespace: babel-system
11:06:39AM:  L ok: waiting on replicaset/babel-frontend-767cc84cfd (apps/v1) namespace: babel-system
11:06:39AM:  L ok: waiting on replicaset/babel-frontend-5ff48b84b4 (apps/v1) namespace: babel-system
11:06:39AM:  L ok: waiting on replicaset/babel-frontend-5f78c5ffbf (apps/v1) namespace: babel-system
11:06:39AM:  L ok: waiting on replicaset/babel-frontend-5cc79b84d7 (apps/v1) namespace: babel-system
11:06:39AM:  L ok: waiting on replicaset/babel-frontend-59cd84567d (apps/v1) namespace: babel-system
11:06:39AM:  L ok: waiting on replicaset/babel-frontend-59485bc9d9 (apps/v1) namespace: babel-system
11:06:39AM:  L ok: waiting on replicaset/babel-frontend-5864b55844 (apps/v1) namespace: babel-system
11:06:39AM:  L ok: waiting on replicaset/babel-frontend-5454d6449c (apps/v1) namespace: babel-system
11:06:42AM: ongoing: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
11:06:42AM:  ^ Waiting for 1 unavailable replicas
11:06:42AM:  L ok: waiting on replicaset/babel-frontend-fcb7c87dd (apps/v1) namespace: babel-system
11:06:42AM:  L ok: waiting on replicaset/babel-frontend-c9fcf49f5 (apps/v1) namespace: babel-system
11:06:42AM:  L ok: waiting on replicaset/babel-frontend-b68f7cf9b (apps/v1) namespace: babel-system
11:06:42AM:  L ok: waiting on replicaset/babel-frontend-767cc84cfd (apps/v1) namespace: babel-system
11:06:42AM:  L ok: waiting on replicaset/babel-frontend-5ff48b84b4 (apps/v1) namespace: babel-system
11:06:42AM:  L ok: waiting on replicaset/babel-frontend-5f78c5ffbf (apps/v1) namespace: babel-system
11:06:42AM:  L ok: waiting on replicaset/babel-frontend-5cc79b84d7 (apps/v1) namespace: babel-system
11:06:42AM:  L ok: waiting on replicaset/babel-frontend-59cd84567d (apps/v1) namespace: babel-system
11:06:42AM:  L ok: waiting on replicaset/babel-frontend-59485bc9d9 (apps/v1) namespace: babel-system
11:06:42AM:  L ok: waiting on replicaset/babel-frontend-5864b55844 (apps/v1) namespace: babel-system
11:06:42AM:  L ok: waiting on replicaset/babel-frontend-5454d6449c (apps/v1) namespace: babel-system
11:06:42AM:  L ongoing: waiting on pod/babel-frontend-5454d6449c-hzhfs (v1) namespace: babel-system
11:06:42AM:     ^ Condition Ready is not True (False)
11:06:51AM: ok: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
11:06:51AM: ---- applying complete [4/4 done] ----
11:06:51AM: ---- waiting complete [4/4 done] ----
 ➜ Setup port forwarding...
Force restart or not running process found, clean-up kwt-net pod...
Clean-up krelay-server pod...
No proxy needed, you are outside the wall.
Stopping `supervisor`... (might take a while)
==> Successfully stopped `supervisor` (label: homebrew.mxcl.supervisor)
 ✔ Port forwarding completed, elapsed 2m 6s
 ✔ Installed Babel App, elapsed 4m 17s
git pull
remote: Enumerating objects: 162, done.
remote: Counting objects: 100% (162/162), done.
remote: Compressing objects: 100% (87/87), done.
remote: Total 162 (delta 86), reused 142 (delta 75), pack-reused 0 (from 0)
Receiving objects: 100% (162/162), 66.09 KiB | 1.50 MiB/s, done.
Resolving deltas: 100% (86/86), completed with 12 local objects.
From github.com:babelcloud/babel-umbrella
   e80acee..11504a5  main       -> origin/main
Fetching submodule agent
From github.com:babelcloud/babel-agent
 * [new branch]      gru-tester-src-agents-commands-impl-issue-verification-index-ts -> origin/gru-tester-src-agents-commands-impl-issue-verification-index-ts
 * [new branch]      gru-tester-src-agents-commands-impl-set-file-change-plan-index-ts -> origin/gru-tester-src-agents-commands-impl-set-file-change-plan-index-ts
 * [new branch]      gru-tester-src-agents-impl-swe-query-code-index-ts -> origin/gru-tester-src-agents-impl-swe-query-code-index-ts
 * [new branch]      gru-tester-src-agents-utils-marshal-marshal-ts -> origin/gru-tester-src-agents-utils-marshal-marshal-ts
 * [new branch]      gru-tester-src-agents-utils-marshal-parse-tool-calls-index-ts -> origin/gru-tester-src-agents-utils-marshal-parse-tool-calls-index-ts
 * [new branch]      gru-tester-src-agents-utils-misc-wait-ts -> origin/gru-tester-src-agents-utils-misc-wait-ts
 * [new branch]      gru-tester-src-agents-utils-parse-markdown-link-index-ts -> origin/gru-tester-src-agents-utils-parse-markdown-link-index-ts
 * [new branch]      gru-tester-src-models-plan-plan-types-ts -> origin/gru-tester-src-models-plan-plan-types-ts
 * [new branch]      hax/unit-test-tss-tools -> origin/hax/unit-test-tss-tools
   bb81845..8ed7ef3  main                    -> origin/main
 * [new branch]      vitester-src-agents-commands-ctx-provider-registry-ts -> origin/vitester-src-agents-commands-ctx-provider-registry-ts
 * [new branch]      vitester-src-agents-commands-impl-workspace-delete-element-ts -> origin/vitester-src-agents-commands-impl-workspace-delete-element-ts
 * [new branch]      vitester-src-agents-commands-impl-workspace-search-trace-index-ts -> origin/vitester-src-agents-commands-impl-workspace-search-trace-index-ts
 * [new branch]      vitester-src-agents-commands-impl-workspace-set-and-run-test-ts -> origin/vitester-src-agents-commands-impl-workspace-set-and-run-test-ts
 + 789e896...8f41da0 vitester-src-agents-framework-knowledge-ts -> origin/vitester-src-agents-framework-knowledge-ts  (forced update)
 * [new branch]      vitester-src-agents-framework-types-ts -> origin/vitester-src-agents-framework-types-ts
 * [new branch]      vitester-src-agents-framework-work-unit-timeout-ts -> origin/vitester-src-agents-framework-work-unit-timeout-ts
 * [new branch]      vitester-src-agents-utils-check-http-url-index-ts -> origin/vitester-src-agents-utils-check-http-url-index-ts
 * [new branch]      vitester-src-index-ts   -> origin/vitester-src-index-ts
 * [new branch]      zthreefires/add-path-to-result-and-eslint-directive -> origin/zthreefires/add-path-to-result-and-eslint-directive
Fetching submodule controller
From github.com:babelcloud/babel-controller
   3173c09..e6be1d5  main       -> origin/main
Fetching submodule frontend
From github.com:babelcloud/babel-frontend
   7214d7c9..e405d8a9  main       -> origin/main
Fetching submodule sandbox
From github.com:babelcloud/babel-sandbox
 * [new branch]      cxz/feat/unit-tester -> origin/cxz/feat/unit-tester
 * [new branch]      cxz/refactor/image   -> origin/cxz/refactor/image
 * [new branch]      hax/add-screen       -> origin/hax/add-screen
 * [new branch]      hax/session-service  -> origin/hax/session-service
   1d9c2ac..2939618  main                 -> origin/main
 * [new branch]      test-multi-arch-image-build -> origin/test-multi-arch-image-build
Updating e80acee..11504a5
Fast-forward
 .github/workflows/image-build.yml                            |  10 ++++++---
 agent                                                        |   2 +-
 controller                                                   |   2 +-
 deploy/commons/babel/agent.yaml                              |  18 ++++++++++++++-
 deploy/commons/babel/networkpolicy.yml                       |   4 ++++
 deploy/commons/commons.sh                                    |   7 +++---
 deploy/commons/scripts/setup/upsert-config.sh                |   3 +++
 deploy/local/scripts/charts/csi-driver-nfs-4.5.0.tgz         | Bin 13225 -> 0 bytes
 deploy/local/scripts/charts/csi-driver-nfs-v4.9.0.tgz        | Bin 0 -> 11365 bytes
 deploy/local/scripts/charts/openobserve-collector-0.3.11.tgz | Bin 0 -> 8847 bytes
 deploy/local/scripts/install-app.sh                          |  26 ++++++++++++++++-----
 deploy/local/scripts/install-infra.sh                        |   9 ++++----
 deploy/local/scripts/install-minio.sh                        |   7 +++++-
 deploy/local/scripts/install-nfs.sh                          |   4 ++--
 deploy/local/scripts/install-o2.sh                           | 175 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++------------------
 deploy/local/scripts/install-postgresql.sh                   |   8 ++++++-
 deploy/local/scripts/install-rabbitmq.sh                     |   6 +++++
 deploy/local/scripts/install-redis.sh                        |   6 +++++
 deploy/local/scripts/install-tools.sh                        |   3 ++-
 deploy/local/scripts/port-forwarding/babel.conf              |   2 +-
 deploy/local/scripts/preload-image.sh                        |  34 +++++++++++++++++-----------
 deploy/local/scripts/preload-image/image-list.arm64.txt      |  18 ++++++++++-----
 deploy/local/scripts/preload-service-image.sh                |  13 ++++++++++-
 deploy/local/scripts/upsert-config.sh                        |   3 +++
 frontend                                                     |   2 +-
 gru-home                                                     |   2 +-
 sandbox                                                      |   2 +-
 27 files changed, 297 insertions(+), 69 deletions(-)
 delete mode 100644 deploy/local/scripts/charts/csi-driver-nfs-4.5.0.tgz
 create mode 100644 deploy/local/scripts/charts/csi-driver-nfs-v4.9.0.tgz
 create mode 100644 deploy/local/scripts/charts/openobserve-collector-0.3.11.tgz
git submodule update
Submodule path 'agent': checked out '8ed7ef30293364ff60227215e12a27d9bfec9cc2'
Submodule path 'controller': checked out 'e6be1d5e7f83cfd7e3b0d2302ac19f4b00ab04bf'
Submodule path 'frontend': checked out 'e405d8a9534f51078d30ea89c851b367a3093d9c'
Submodule path 'sandbox': checked out '2939618a4e7a7e70161c68c497ab9fc4376b120b'
make install-app
Services run locally: agent

 ✔ Preload service images, elapsed 10m 25s
Target cluster 'https://0.0.0.0:40180' (nodes: babelcloud-control-plane)

@@ update deployment/babel-agent (apps/v1) namespace: babel-system @@
  ...
  5,  5       deployment.kubernetes.io/revision: "30"
      6 +     instrumentation.opentelemetry.io/inject-nodejs: "true"
  6,  7       kapp.k14s.io/change-group: babel-agent
  7,  8       kapp.k14s.io/change-rule: upsert before upserting babel-controller
  ...
627,628           - name: SANDBOX_IMAGE
628     -           value: ghcr.io/babelcloud/babel-sandbox:1d9c2ac
    629 +           value: ghcr.io/babelcloud/babel-sandbox:2939618
629,630           - name: SANDBOX_NODE_GROUP
630,631             value: ""
  ...
689,690                 key: swe_rag_token
    691 +               name: babel-infra-secret
    692 +         - name: UT_AGENT_GITHUB_APP_ID
    693 +           valueFrom:
    694 +             configMapKeyRef:
    695 +               key: ut_agent_github_app_id
    696 +               name: babel-infra-config
    697 +         - name: UT_AGENT_GITHUB_APP_PRIVATE_KEY
    698 +           valueFrom:
    699 +             secretKeyRef:
    700 +               key: ut_agent_github_app_private_key
    701 +               name: babel-infra-secret
    702 +         - name: UT_AGENT_GITHUB_APP_WEBHOOK_SECRET
    703 +           valueFrom:
    704 +             secretKeyRef:
    705 +               key: ut_agent_github_app_webhook_secret
690,706                 name: babel-infra-secret
691     -         image: ghcr.io/babelcloud/babel-agent:5dcf4b9
    707 +         image: ghcr.io/babelcloud/babel-agent:8ed7ef3
692,708           imagePullPolicy: IfNotPresent
693,709           livenessProbe:
@@ update deployment/babel-controller (apps/v1) namespace: babel-system @@
  ...
535,535           - name: BABELCLOUD_REVISION
536     -           value: e80aceeafa88f999f34863a8a0877889a1770229
    536 +           value: 11504a518c3c3938c0a395b321388ec21423ac06
537,537           - name: BABELCLOUD_ENVIRONMENT
538,538             valueFrom:
  ...
782,782             value: "false"
783     -         image: ghcr.io/babelcloud/babel-controller:3173c09
    783 +         image: ghcr.io/babelcloud/babel-controller:e6be1d5
784,784           imagePullPolicy: IfNotPresent
785,785           livenessProbe:
@@ update deployment/babel-frontend (apps/v1) namespace: babel-system @@
  ...
166,166                 name: babel-infra-config
167     -         image: ghcr.io/babelcloud/babel-frontend:7214d7c
    167 +         image: ghcr.io/babelcloud/babel-frontend:e405d8a
168,168           imagePullPolicy: IfNotPresent
169,169           livenessProbe:
@@ update deployment/gru-home (apps/v1) namespace: babel-system @@
  ...
144,144         containers:
145     -       - image: ghcr.io/babelcloud/gru-home:af4c96e
    145 +       - image: ghcr.io/babelcloud/gru-home:70cf309
146,146           imagePullPolicy: IfNotPresent
147,147           livenessProbe:
@@ update daemonset/image-keeper (apps/v1) namespace: babel-tenant @@
  ...
 94, 94         containers:
 95     -       - image: ghcr.io/babelcloud/babel-sandbox:1d9c2ac
     95 +       - image: ghcr.io/babelcloud/babel-sandbox:2939618
 96, 96           name: sandbox-image-keeper
 97, 97         dnsConfig:
@@ update networkpolicy/babel-runtime-network-policy (networking.k8s.io/v1) namespace: babel-tenant @@
  ...
 48, 48           - 192.168.0.0/16
 49     -         - 198.18.0.0/15
 50, 49           - 198.51.100.0/24
 51, 50           - 203.0.113.0/24
@@ update networkpolicy/babel-sandbox-network-policy (networking.k8s.io/v1) namespace: babel-tenant @@
  ...
 48, 48           - 192.168.0.0/16
 49     -         - 198.18.0.0/15
 50, 49           - 198.51.100.0/24
 51, 50           - 203.0.113.0/24
@@ update networkpolicy/babel-toolbox-network-policy (networking.k8s.io/v1) namespace: babel-tenant @@
  ...
 48, 48           - 192.168.0.0/16
 49     -         - 198.18.0.0/15
 50, 49           - 198.51.100.0/24
 51, 50           - 203.0.113.0/24
@@ update service/babel-toolbox (v1) namespace: babel-tenant @@
  ...
  2,  2   metadata:
  3     -   annotations: {}
  4,  3     creationTimestamp: "2024-07-20T15:48:28Z"
  5,  4     labels:
  ...
 54, 53     clusterIP: 10.96.141.65
 55     -   clusterIPs:
 56     -   - 10.96.141.65
 57     -   internalTrafficPolicy: Cluster
 58     -   ipFamilies:
 59     -   - IPv4
 60     -   ipFamilyPolicy: SingleStack
 61, 54     ports:
 62     -   - name: port0
 63     -     port: 3010
 64     -     protocol: TCP
 65     -     targetPort: 38029
     55 +   - port: 3010
 66, 56     selector:
 67     -     kwt.cppforlife.com/net: "true"
 68     -   sessionAffinity: None
     57 +     kapp.k14s.io/app: "1721490507501923000"
     58 +     module: babel-toolbox
 69, 59     type: ClusterIP
 70, 60

Changes

Namespace     Name                          Kind           Age  Op      Op st.  Wait to    Rs  Ri
babel-system  babel-agent                   Deployment     71d  update  -       reconcile  ok  -
^             babel-controller              Deployment     71d  update  -       reconcile  ok  -
^             babel-frontend                Deployment     71d  update  -       reconcile  ok  -
^             gru-home                      Deployment     18d  update  -       reconcile  ok  -
babel-tenant  babel-runtime-network-policy  NetworkPolicy  71d  update  -       reconcile  ok  -
^             babel-sandbox-network-policy  NetworkPolicy  71d  update  -       reconcile  ok  -
^             babel-toolbox                 Service        71d  update  -       reconcile  ok  -
^             babel-toolbox-network-policy  NetworkPolicy  52d  update  -       reconcile  ok  -
^             image-keeper                  DaemonSet      71d  update  -       reconcile  ok  -

Op:      0 create, 0 delete, 9 update, 0 noop, 0 exists
Wait to: 9 reconcile, 0 delete, 0 noop

7:26:40PM: ---- applying 3 changes [0/9 done] ----
Warning: unknown field "spec.egress[2].to[0].ports"
7:26:40PM: update networkpolicy/babel-sandbox-network-policy (networking.k8s.io/v1) namespace: babel-tenant
7:26:40PM: update networkpolicy/babel-toolbox-network-policy (networking.k8s.io/v1) namespace: babel-tenant
7:26:40PM: update networkpolicy/babel-runtime-network-policy (networking.k8s.io/v1) namespace: babel-tenant
7:26:40PM: ---- waiting on 3 changes [0/9 done] ----
7:26:40PM: ok: reconcile networkpolicy/babel-toolbox-network-policy (networking.k8s.io/v1) namespace: babel-tenant
7:26:40PM: ok: reconcile networkpolicy/babel-sandbox-network-policy (networking.k8s.io/v1) namespace: babel-tenant
7:26:40PM: ok: reconcile networkpolicy/babel-runtime-network-policy (networking.k8s.io/v1) namespace: babel-tenant
7:26:40PM: ---- applying 4 changes [3/9 done] ----
7:26:40PM: update service/babel-toolbox (v1) namespace: babel-tenant
7:26:40PM: update deployment/gru-home (apps/v1) namespace: babel-system
7:26:40PM: update daemonset/image-keeper (apps/v1) namespace: babel-tenant
7:26:40PM: update deployment/babel-agent (apps/v1) namespace: babel-system
7:26:40PM: ---- waiting on 4 changes [3/9 done] ----
7:26:40PM: ok: reconcile service/babel-toolbox (v1) namespace: babel-tenant
7:26:40PM: ongoing: reconcile daemonset/image-keeper (apps/v1) namespace: babel-tenant
7:26:40PM:  ^ Waiting for generation 3 to be observed
7:26:40PM:  L ongoing: waiting on pod/image-keeper-dklnc (v1) namespace: babel-tenant
7:26:40PM:     ^ Deleting
7:26:40PM: ongoing: reconcile deployment/gru-home (apps/v1) namespace: babel-system
7:26:40PM:  ^ Waiting for generation 6 to be observed
7:26:40PM:  L ok: waiting on replicaset/gru-home-86997b7c7 (apps/v1) namespace: babel-system
7:26:40PM:  L ok: waiting on replicaset/gru-home-7f777f9b76 (apps/v1) namespace: babel-system
7:26:40PM:  L ok: waiting on replicaset/gru-home-55cb8b7b9c (apps/v1) namespace: babel-system
7:26:40PM:  L ok: waiting on pod/gru-home-55cb8b7b9c-xr25j (v1) namespace: babel-system
7:26:40PM: ongoing: reconcile deployment/babel-agent (apps/v1) namespace: babel-system
7:26:40PM:  ^ Waiting for generation 58 to be observed
7:26:40PM:  L ok: waiting on replicaset/babel-agent-85b7978cb7 (apps/v1) namespace: babel-system
7:26:40PM:  L ok: waiting on replicaset/babel-agent-85b4578ddd (apps/v1) namespace: babel-system
7:26:40PM:  L ok: waiting on replicaset/babel-agent-845dcc76db (apps/v1) namespace: babel-system
7:26:40PM:  L ok: waiting on replicaset/babel-agent-7cbdbbc696 (apps/v1) namespace: babel-system
7:26:40PM:  L ok: waiting on replicaset/babel-agent-7c667b954 (apps/v1) namespace: babel-system
7:26:40PM:  L ok: waiting on replicaset/babel-agent-764ddb747f (apps/v1) namespace: babel-system
7:26:40PM:  L ok: waiting on replicaset/babel-agent-6f8b64c7fb (apps/v1) namespace: babel-system
7:26:40PM:  L ok: waiting on replicaset/babel-agent-6c5bb948dc (apps/v1) namespace: babel-system
7:26:40PM:  L ok: waiting on replicaset/babel-agent-64fb48c56 (apps/v1) namespace: babel-system
7:26:40PM:  L ok: waiting on replicaset/babel-agent-5cccb887bc (apps/v1) namespace: babel-system
7:26:40PM:  L ok: waiting on replicaset/babel-agent-56dfb9dffc (apps/v1) namespace: babel-system
7:26:40PM:  L ok: waiting on replicaset/babel-agent-545b76cf8f (apps/v1) namespace: babel-system
7:26:40PM: ---- waiting on 3 changes [4/9 done] ----
7:26:40PM: ongoing: reconcile daemonset/image-keeper (apps/v1) namespace: babel-tenant
7:26:40PM:  ^ Waiting for 1 updated pods to be scheduled
7:26:40PM:  L ongoing: waiting on pod/image-keeper-dklnc (v1) namespace: babel-tenant
7:26:40PM:     ^ Deleting
7:26:40PM: ongoing: reconcile deployment/gru-home (apps/v1) namespace: babel-system
7:26:40PM:  ^ Waiting for 1 unavailable replicas
7:26:40PM:  L ok: waiting on replicaset/gru-home-86997b7c7 (apps/v1) namespace: babel-system
7:26:40PM:  L ok: waiting on replicaset/gru-home-7f777f9b76 (apps/v1) namespace: babel-system
7:26:40PM:  L ok: waiting on replicaset/gru-home-55cb8b7b9c (apps/v1) namespace: babel-system
7:26:40PM:  L ongoing: waiting on pod/gru-home-86997b7c7-v4nv5 (v1) namespace: babel-system
7:26:40PM:     ^ Pending: ContainerCreating
7:26:40PM:  L ok: waiting on pod/gru-home-55cb8b7b9c-xr25j (v1) namespace: babel-system
7:26:43PM: ok: reconcile daemonset/image-keeper (apps/v1) namespace: babel-tenant
7:26:43PM: ongoing: reconcile deployment/gru-home (apps/v1) namespace: babel-system
7:26:43PM:  ^ Waiting for 1 unavailable replicas
7:26:43PM:  L ok: waiting on replicaset/gru-home-86997b7c7 (apps/v1) namespace: babel-system
7:26:43PM:  L ok: waiting on replicaset/gru-home-7f777f9b76 (apps/v1) namespace: babel-system
7:26:43PM:  L ok: waiting on replicaset/gru-home-55cb8b7b9c (apps/v1) namespace: babel-system
7:26:43PM:  L ongoing: waiting on pod/gru-home-86997b7c7-v4nv5 (v1) namespace: babel-system
7:26:43PM:     ^ Condition Ready is not True (False)
7:26:43PM:  L ok: waiting on pod/gru-home-55cb8b7b9c-xr25j (v1) namespace: babel-system
7:26:43PM: ok: reconcile deployment/babel-agent (apps/v1) namespace: babel-system
7:26:43PM: ---- applying 1 changes [7/9 done] ----
7:26:45PM: update deployment/babel-controller (apps/v1) namespace: babel-system
7:26:45PM: ---- waiting on 2 changes [6/9 done] ----
7:26:45PM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
7:26:45PM:  ^ Waiting for generation 62 to be observed
7:26:45PM:  L ok: waiting on replicaset/babel-controller-f966bf8f8 (apps/v1) namespace: babel-system
7:26:45PM:  L ok: waiting on replicaset/babel-controller-df4ff8846 (apps/v1) namespace: babel-system
7:26:45PM:  L ok: waiting on replicaset/babel-controller-cb646cbdd (apps/v1) namespace: babel-system
7:26:45PM:  L ok: waiting on replicaset/babel-controller-9bfb8787b (apps/v1) namespace: babel-system
7:26:45PM:  L ok: waiting on replicaset/babel-controller-8565b956f7 (apps/v1) namespace: babel-system
7:26:45PM:  L ok: waiting on replicaset/babel-controller-7f4678b6 (apps/v1) namespace: babel-system
7:26:45PM:  L ok: waiting on replicaset/babel-controller-7c66594978 (apps/v1) namespace: babel-system
7:26:45PM:  L ok: waiting on replicaset/babel-controller-747bfc57f6 (apps/v1) namespace: babel-system
7:26:45PM:  L ok: waiting on replicaset/babel-controller-6f4d79dbb6 (apps/v1) namespace: babel-system
7:26:45PM:  L ok: waiting on replicaset/babel-controller-6b5fb485bc (apps/v1) namespace: babel-system
7:26:45PM:  L ok: waiting on replicaset/babel-controller-6789b45f9d (apps/v1) namespace: babel-system
7:26:45PM:  L ok: waiting on replicaset/babel-controller-5dd8f4596c (apps/v1) namespace: babel-system
7:26:45PM:  L ongoing: waiting on pod/babel-controller-f966bf8f8-7m5p7 (v1) namespace: babel-system
7:26:45PM:     ^ Pending: PodInitializing
7:26:45PM:  L ok: waiting on pod/babel-controller-9bfb8787b-f6mhh (v1) namespace: babel-system
7:26:48PM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
7:26:48PM:  ^ Waiting for 1 unavailable replicas
7:26:48PM:  L ok: waiting on replicaset/babel-controller-f966bf8f8 (apps/v1) namespace: babel-system
7:26:48PM:  L ok: waiting on replicaset/babel-controller-df4ff8846 (apps/v1) namespace: babel-system
7:26:48PM:  L ok: waiting on replicaset/babel-controller-cb646cbdd (apps/v1) namespace: babel-system
7:26:48PM:  L ok: waiting on replicaset/babel-controller-9bfb8787b (apps/v1) namespace: babel-system
7:26:48PM:  L ok: waiting on replicaset/babel-controller-8565b956f7 (apps/v1) namespace: babel-system
7:26:48PM:  L ok: waiting on replicaset/babel-controller-7f4678b6 (apps/v1) namespace: babel-system
7:26:48PM:  L ok: waiting on replicaset/babel-controller-7c66594978 (apps/v1) namespace: babel-system
7:26:48PM:  L ok: waiting on replicaset/babel-controller-747bfc57f6 (apps/v1) namespace: babel-system
7:26:48PM:  L ok: waiting on replicaset/babel-controller-6f4d79dbb6 (apps/v1) namespace: babel-system
7:26:48PM:  L ok: waiting on replicaset/babel-controller-6b5fb485bc (apps/v1) namespace: babel-system
7:26:48PM:  L ok: waiting on replicaset/babel-controller-6789b45f9d (apps/v1) namespace: babel-system
7:26:48PM:  L ok: waiting on replicaset/babel-controller-5dd8f4596c (apps/v1) namespace: babel-system
7:26:48PM:  L ongoing: waiting on pod/babel-controller-f966bf8f8-7m5p7 (v1) namespace: babel-system
7:26:48PM:     ^ Condition Ready is not True (False)
7:26:48PM:  L ok: waiting on pod/babel-controller-9bfb8787b-f6mhh (v1) namespace: babel-system
7:26:54PM: ok: reconcile deployment/gru-home (apps/v1) namespace: babel-system
7:26:54PM: ---- waiting on 1 changes [7/9 done] ----
7:27:06PM: ok: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
7:27:06PM: ---- applying 1 changes [8/9 done] ----
7:27:06PM: update deployment/babel-frontend (apps/v1) namespace: babel-system
7:27:06PM: ---- waiting on 1 changes [8/9 done] ----
7:27:06PM: ongoing: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
7:27:06PM:  ^ Waiting for generation 48 to be observed
7:27:06PM:  L ok: waiting on replicaset/babel-frontend-fcb7c87dd (apps/v1) namespace: babel-system
7:27:06PM:  L ok: waiting on replicaset/babel-frontend-c9fcf49f5 (apps/v1) namespace: babel-system
7:27:06PM:  L ok: waiting on replicaset/babel-frontend-b68f7cf9b (apps/v1) namespace: babel-system
7:27:06PM:  L ok: waiting on replicaset/babel-frontend-767cc84cfd (apps/v1) namespace: babel-system
7:27:06PM:  L ok: waiting on replicaset/babel-frontend-5ff48b84b4 (apps/v1) namespace: babel-system
7:27:06PM:  L ok: waiting on replicaset/babel-frontend-5f78c5ffbf (apps/v1) namespace: babel-system
7:27:06PM:  L ok: waiting on replicaset/babel-frontend-5cc79b84d7 (apps/v1) namespace: babel-system
7:27:06PM:  L ok: waiting on replicaset/babel-frontend-59cd84567d (apps/v1) namespace: babel-system
7:27:06PM:  L ok: waiting on replicaset/babel-frontend-59485bc9d9 (apps/v1) namespace: babel-system
7:27:06PM:  L ok: waiting on replicaset/babel-frontend-5864b55844 (apps/v1) namespace: babel-system
7:27:06PM:  L ok: waiting on replicaset/babel-frontend-565cd4c8 (apps/v1) namespace: babel-system
7:27:06PM:  L ok: waiting on replicaset/babel-frontend-5454d6449c (apps/v1) namespace: babel-system
7:27:06PM:  L ongoing: waiting on pod/babel-frontend-565cd4c8-gr4pn (v1) namespace: babel-system
7:27:06PM:     ^ Pending
7:27:06PM:  L ok: waiting on pod/babel-frontend-5454d6449c-hzhfs (v1) namespace: babel-system
7:27:09PM: ongoing: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
7:27:09PM:  ^ Waiting for 1 unavailable replicas
7:27:09PM:  L ok: waiting on replicaset/babel-frontend-fcb7c87dd (apps/v1) namespace: babel-system
7:27:09PM:  L ok: waiting on replicaset/babel-frontend-c9fcf49f5 (apps/v1) namespace: babel-system
7:27:09PM:  L ok: waiting on replicaset/babel-frontend-b68f7cf9b (apps/v1) namespace: babel-system
7:27:09PM:  L ok: waiting on replicaset/babel-frontend-767cc84cfd (apps/v1) namespace: babel-system
7:27:09PM:  L ok: waiting on replicaset/babel-frontend-5ff48b84b4 (apps/v1) namespace: babel-system
7:27:09PM:  L ok: waiting on replicaset/babel-frontend-5f78c5ffbf (apps/v1) namespace: babel-system
7:27:09PM:  L ok: waiting on replicaset/babel-frontend-5cc79b84d7 (apps/v1) namespace: babel-system
7:27:09PM:  L ok: waiting on replicaset/babel-frontend-59cd84567d (apps/v1) namespace: babel-system
7:27:09PM:  L ok: waiting on replicaset/babel-frontend-59485bc9d9 (apps/v1) namespace: babel-system
7:27:09PM:  L ok: waiting on replicaset/babel-frontend-5864b55844 (apps/v1) namespace: babel-system
7:27:09PM:  L ok: waiting on replicaset/babel-frontend-565cd4c8 (apps/v1) namespace: babel-system
7:27:09PM:  L ok: waiting on replicaset/babel-frontend-5454d6449c (apps/v1) namespace: babel-system
7:27:09PM:  L ongoing: waiting on pod/babel-frontend-565cd4c8-gr4pn (v1) namespace: babel-system
7:27:09PM:     ^ Condition Ready is not True (False)
7:27:09PM:  L ok: waiting on pod/babel-frontend-5454d6449c-hzhfs (v1) namespace: babel-system
7:27:18PM: ok: reconcile deployment/babel-frontend (apps/v1) namespace: babel-system
7:27:18PM: ---- applying complete [9/9 done] ----
7:27:18PM: ---- waiting complete [9/9 done] ----

Succeeded
Deleted: ghcr.io/babelcloud/babel-frontend:7214d7c
 ➜ Setup port forwarding...
Force restart or not running process found, clean-up kwt-net pod...
Clean-up krelay-server pod...
No proxy needed, you are outside the wall.
Stopping `supervisor`... (might take a while)
==> Successfully stopped `supervisor` (label: homebrew.mxcl.supervisor)
 ✔ Port forwarding completed, elapsed 2m 6s
 ✔ Installed Babel App, elapsed 13m 15s
git pull
remote: Enumerating objects: 71, done.
remote: Counting objects: 100% (71/71), done.
remote: Compressing objects: 100% (34/34), done.
remote: Total 53 (delta 33), reused 36 (delta 19), pack-reused 0 (from 0)
Unpacking objects: 100% (53/53), 421.77 KiB | 1.76 MiB/s, done.
From github.com:babelcloud/babel-umbrella
   11504a5..17055f7  main       -> origin/main
Fetching submodule agent
From github.com:babelcloud/babel-agent
   8ed7ef3..30e10a1  main       -> origin/main
Fetching submodule sandbox
From github.com:babelcloud/babel-sandbox
 * [new branch]      cxz/fix/console      -> origin/cxz/fix/console
 * [new branch]      cxz/test/integration -> origin/cxz/test/integration
   2939618..e3e68eb  main                 -> origin/main
Updating 11504a5..17055f7
Fast-forward
 agent                                                        |   2 +-
 deploy/local/scripts/charts/bitnami_minio-14.6.32.tgz        | Bin 56702 -> 0 bytes
 deploy/local/scripts/charts/bitnami_postgresql-15.5.20.tgz   | Bin 75723 -> 0 bytes
 deploy/local/scripts/charts/bitnami_rabbitmq-14.6.6.tgz      | Bin 66376 -> 0 bytes
 deploy/local/scripts/charts/bitnami_redis-19.6.4.tgz         | Bin 91193 -> 0 bytes
 deploy/local/scripts/charts/minio-14.7.13.tgz                | Bin 0 -> 56995 bytes
 deploy/local/scripts/charts/openobserve-0.12.2.tgz           | Bin 0 -> 102091 bytes
 deploy/local/scripts/charts/openobserve-collector-0.3.11.tgz | Bin 8847 -> 8850 bytes
 deploy/local/scripts/charts/postgresql-15.5.36.tgz           | Bin 0 -> 75785 bytes
 deploy/local/scripts/charts/rabbitmq-15.0.1.tgz              | Bin 0 -> 68573 bytes
 deploy/local/scripts/charts/redis-20.1.5.tgz                 | Bin 0 -> 103244 bytes
 deploy/local/scripts/charts/reloader-1.1.0.tgz               | Bin 0 -> 8888 bytes
 deploy/local/scripts/charts/update.sh                        |  33 +++++++++++++++++++++++++++++++++
 deploy/local/scripts/install-minio.sh                        |   4 ++--
 deploy/local/scripts/install-o2.sh                           |  22 ++++++++++------------
 deploy/local/scripts/install-postgresql.sh                   |  11 ++++++++---
 deploy/local/scripts/install-rabbitmq.sh                     |   4 ++--
 deploy/local/scripts/install-redis.sh                        |   4 ++--
 deploy/local/scripts/install-reloader.sh                     |   2 +-
 deploy/local/scripts/postgresql/Dockerfile                   |   2 +-
 deploy/local/scripts/postgresql/build.sh                     |   3 ++-
 deploy/local/scripts/preload-image/image-list.arm64.txt      |  18 +++++++++---------
 deploy/local/scripts/preload-image/middleware-images.sh      |   1 +
 sandbox                                                      |   2 +-
 24 files changed, 73 insertions(+), 35 deletions(-)
 delete mode 100644 deploy/local/scripts/charts/bitnami_minio-14.6.32.tgz
 delete mode 100644 deploy/local/scripts/charts/bitnami_postgresql-15.5.20.tgz
 delete mode 100644 deploy/local/scripts/charts/bitnami_rabbitmq-14.6.6.tgz
 delete mode 100644 deploy/local/scripts/charts/bitnami_redis-19.6.4.tgz
 create mode 100644 deploy/local/scripts/charts/minio-14.7.13.tgz
 create mode 100644 deploy/local/scripts/charts/openobserve-0.12.2.tgz
 create mode 100644 deploy/local/scripts/charts/postgresql-15.5.36.tgz
 create mode 100644 deploy/local/scripts/charts/rabbitmq-15.0.1.tgz
 create mode 100644 deploy/local/scripts/charts/redis-20.1.5.tgz
 create mode 100644 deploy/local/scripts/charts/reloader-1.1.0.tgz
 create mode 100755 deploy/local/scripts/charts/update.sh
git submodule update
Submodule path 'agent': checked out '30e10a13f48c7513e2b4adda2333d26fa726799f'
Submodule path 'sandbox': checked out 'e3e68ebaa69096847931c38a4a1cf26f8975dbf5'
make install-app
Services run locally: agent

 ✔ Preload service images, elapsed 4m 30s
Target cluster 'https://0.0.0.0:40180' (nodes: babelcloud-control-plane)

@@ update deployment/babel-agent (apps/v1) namespace: babel-system @@
  ...
647,647           - name: SANDBOX_IMAGE
648     -           value: ghcr.io/babelcloud/babel-sandbox:2939618
    648 +           value: ghcr.io/babelcloud/babel-sandbox:e3e68eb
649,649           - name: SANDBOX_NODE_GROUP
650,650             value: ""
  ...
725,725                 name: babel-infra-secret
726     -         image: ghcr.io/babelcloud/babel-agent:8ed7ef3
    726 +         image: ghcr.io/babelcloud/babel-agent:30e10a1
727,727           imagePullPolicy: IfNotPresent
728,728           livenessProbe:
@@ update deployment/babel-controller (apps/v1) namespace: babel-system @@
  ...
535,535           - name: BABELCLOUD_REVISION
536     -           value: 11504a518c3c3938c0a395b321388ec21423ac06
    536 +           value: 17055f7c0ab36a53aa304fb9335a6e4524405a13
537,537           - name: BABELCLOUD_ENVIRONMENT
538,538             valueFrom:
@@ update daemonset/image-keeper (apps/v1) namespace: babel-tenant @@
  ...
 94, 94         containers:
 95     -       - image: ghcr.io/babelcloud/babel-sandbox:2939618
     95 +       - image: ghcr.io/babelcloud/babel-sandbox:e3e68eb
 96, 96           name: sandbox-image-keeper
 97, 97         dnsConfig:
@@ update service/babel-toolbox (v1) namespace: babel-tenant @@
  ...
  2,  2   metadata:
  3     -   annotations: {}
  4,  3     creationTimestamp: "2024-07-20T15:48:28Z"
  5,  4     labels:
  ...
 54, 53     clusterIP: 10.96.141.65
 55     -   clusterIPs:
 56     -   - 10.96.141.65
 57     -   internalTrafficPolicy: Cluster
 58     -   ipFamilies:
 59     -   - IPv4
 60     -   ipFamilyPolicy: SingleStack
 61, 54     ports:
 62     -   - name: port0
 63     -     port: 3010
 64     -     protocol: TCP
 65     -     targetPort: 42897
     55 +   - port: 3010
 66, 56     selector:
 67     -     kwt.cppforlife.com/net: "true"
 68     -   sessionAffinity: None
     57 +     kapp.k14s.io/app: "1721490507501923000"
     58 +     module: babel-toolbox
 69, 59     type: ClusterIP
 70, 60

Changes

Namespace     Name              Kind        Age  Op      Op st.  Wait to    Rs  Ri
babel-system  babel-agent       Deployment  72d  update  -       reconcile  ok  -
^             babel-controller  Deployment  72d  update  -       reconcile  ok  -
babel-tenant  babel-toolbox     Service     72d  update  -       reconcile  ok  -
^             image-keeper      DaemonSet   72d  update  -       reconcile  ok  -

Op:      0 create, 0 delete, 4 update, 0 noop, 0 exists
Wait to: 4 reconcile, 0 delete, 0 noop

8:18:23PM: ---- applying 3 changes [0/4 done] ----
8:18:23PM: update service/babel-toolbox (v1) namespace: babel-tenant
8:18:23PM: update daemonset/image-keeper (apps/v1) namespace: babel-tenant
8:18:23PM: update deployment/babel-agent (apps/v1) namespace: babel-system
8:18:23PM: ---- waiting on 3 changes [0/4 done] ----
8:18:23PM: ok: reconcile service/babel-toolbox (v1) namespace: babel-tenant
8:18:23PM: ongoing: reconcile daemonset/image-keeper (apps/v1) namespace: babel-tenant
8:18:23PM:  ^ Waiting for generation 4 to be observed
8:18:23PM:  L ongoing: waiting on pod/image-keeper-xtg6t (v1) namespace: babel-tenant
8:18:23PM:     ^ Deleting
8:18:23PM: ongoing: reconcile deployment/babel-agent (apps/v1) namespace: babel-system
8:18:23PM:  ^ Waiting for generation 60 to be observed
8:18:23PM:  L ok: waiting on replicaset/babel-agent-85b7978cb7 (apps/v1) namespace: babel-system
8:18:23PM:  L ok: waiting on replicaset/babel-agent-85b4578ddd (apps/v1) namespace: babel-system
8:18:23PM:  L ok: waiting on replicaset/babel-agent-845dcc76db (apps/v1) namespace: babel-system
8:18:23PM:  L ok: waiting on replicaset/babel-agent-7cbdbbc696 (apps/v1) namespace: babel-system
8:18:23PM:  L ok: waiting on replicaset/babel-agent-7c667b954 (apps/v1) namespace: babel-system
8:18:23PM:  L ok: waiting on replicaset/babel-agent-764ddb747f (apps/v1) namespace: babel-system
8:18:23PM:  L ok: waiting on replicaset/babel-agent-6f8b64c7fb (apps/v1) namespace: babel-system
8:18:23PM:  L ok: waiting on replicaset/babel-agent-6c5bb948dc (apps/v1) namespace: babel-system
8:18:23PM:  L ok: waiting on replicaset/babel-agent-6567977887 (apps/v1) namespace: babel-system
8:18:23PM:  L ok: waiting on replicaset/babel-agent-64fb48c56 (apps/v1) namespace: babel-system
8:18:23PM:  L ok: waiting on replicaset/babel-agent-5cccb887bc (apps/v1) namespace: babel-system
8:18:23PM:  L ok: waiting on replicaset/babel-agent-545b76cf8f (apps/v1) namespace: babel-system
8:18:23PM: ---- waiting on 2 changes [1/4 done] ----
8:18:23PM: ongoing: reconcile daemonset/image-keeper (apps/v1) namespace: babel-tenant
8:18:23PM:  ^ Waiting for 1 updated pods to be scheduled
8:18:23PM:  L ongoing: waiting on pod/image-keeper-xtg6t (v1) namespace: babel-tenant
8:18:23PM:     ^ Deleting
8:18:26PM: ok: reconcile daemonset/image-keeper (apps/v1) namespace: babel-tenant
8:18:26PM: ok: reconcile deployment/babel-agent (apps/v1) namespace: babel-system
8:18:26PM: ---- applying 1 changes [3/4 done] ----
8:18:27PM: update deployment/babel-controller (apps/v1) namespace: babel-system
8:18:27PM: ---- waiting on 1 changes [3/4 done] ----
8:18:27PM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
8:18:27PM:  ^ Waiting for generation 64 to be observed
8:18:27PM:  L ok: waiting on replicaset/babel-controller-f966bf8f8 (apps/v1) namespace: babel-system
8:18:27PM:  L ok: waiting on replicaset/babel-controller-df4ff8846 (apps/v1) namespace: babel-system
8:18:27PM:  L ok: waiting on replicaset/babel-controller-cb646cbdd (apps/v1) namespace: babel-system
8:18:27PM:  L ok: waiting on replicaset/babel-controller-9bfb8787b (apps/v1) namespace: babel-system
8:18:27PM:  L ok: waiting on replicaset/babel-controller-8565b956f7 (apps/v1) namespace: babel-system
8:18:27PM:  L ok: waiting on replicaset/babel-controller-7f4678b6 (apps/v1) namespace: babel-system
8:18:27PM:  L ok: waiting on replicaset/babel-controller-7c66594978 (apps/v1) namespace: babel-system
8:18:27PM:  L ok: waiting on replicaset/babel-controller-795bfc48fc (apps/v1) namespace: babel-system
8:18:27PM:  L ok: waiting on replicaset/babel-controller-747bfc57f6 (apps/v1) namespace: babel-system
8:18:27PM:  L ok: waiting on replicaset/babel-controller-6b5fb485bc (apps/v1) namespace: babel-system
8:18:27PM:  L ok: waiting on replicaset/babel-controller-6789b45f9d (apps/v1) namespace: babel-system
8:18:27PM:  L ok: waiting on replicaset/babel-controller-5dd8f4596c (apps/v1) namespace: babel-system
8:18:27PM:  L ok: waiting on pod/babel-controller-f966bf8f8-7m5p7 (v1) namespace: babel-system
8:18:27PM:  L ongoing: waiting on pod/babel-controller-795bfc48fc-rcfsb (v1) namespace: babel-system
8:18:27PM:     ^ Pending: PodInitializing
8:18:30PM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
8:18:30PM:  ^ Waiting for 1 unavailable replicas
8:18:30PM:  L ok: waiting on replicaset/babel-controller-f966bf8f8 (apps/v1) namespace: babel-system
8:18:30PM:  L ok: waiting on replicaset/babel-controller-df4ff8846 (apps/v1) namespace: babel-system
8:18:30PM:  L ok: waiting on replicaset/babel-controller-cb646cbdd (apps/v1) namespace: babel-system
8:18:30PM:  L ok: waiting on replicaset/babel-controller-9bfb8787b (apps/v1) namespace: babel-system
8:18:30PM:  L ok: waiting on replicaset/babel-controller-8565b956f7 (apps/v1) namespace: babel-system
8:18:30PM:  L ok: waiting on replicaset/babel-controller-7f4678b6 (apps/v1) namespace: babel-system
8:18:30PM:  L ok: waiting on replicaset/babel-controller-7c66594978 (apps/v1) namespace: babel-system
8:18:30PM:  L ok: waiting on replicaset/babel-controller-795bfc48fc (apps/v1) namespace: babel-system
8:18:30PM:  L ok: waiting on replicaset/babel-controller-747bfc57f6 (apps/v1) namespace: babel-system
8:18:30PM:  L ok: waiting on replicaset/babel-controller-6b5fb485bc (apps/v1) namespace: babel-system
8:18:30PM:  L ok: waiting on replicaset/babel-controller-6789b45f9d (apps/v1) namespace: babel-system
8:18:30PM:  L ok: waiting on replicaset/babel-controller-5dd8f4596c (apps/v1) namespace: babel-system
8:18:30PM:  L ok: waiting on pod/babel-controller-f966bf8f8-7m5p7 (v1) namespace: babel-system
8:18:30PM:  L ongoing: waiting on pod/babel-controller-795bfc48fc-rcfsb (v1) namespace: babel-system
8:18:30PM:     ^ Condition Ready is not True (False)
8:18:57PM: ok: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
8:18:57PM: ---- applying complete [4/4 done] ----
8:18:57PM: ---- waiting complete [4/4 done] ----

Succeeded
 ➜ Setup port forwarding...
Force restart or not running process found, clean-up kwt-net pod...


Clean-up krelay-server pod...
No proxy needed, you are outside the wall.
Stopping `supervisor`... (might take a while)
==> Successfully stopped `supervisor` (label: homebrew.mxcl.supervisor)
 ✔ Port forwarding completed, elapsed 2m 6s
 ✔ Installed Babel App, elapsed 7m 15s

git pull
remote: Enumerating objects: 3, done.
remote: Counting objects: 100% (3/3), done.
remote: Compressing objects: 100% (1/1), done.
remote: Total 2 (delta 1), reused 2 (delta 1), pack-reused 0 (from 0)
Unpacking objects: 100% (2/2), 281 bytes | 93.00 KiB/s, done.
From github.com:babelcloud/babel-umbrella
   9fc9c10..5eaa276  main       -> origin/main
Fetching submodule agent
From github.com:babelcloud/babel-agent
 * [new branch]      hailong/testgru-improve -> origin/hailong/testgru-improve
   b45b91b..2dccd6c  main                    -> origin/main
Updating 9fc9c10..5eaa276
Fast-forward
 agent | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
git submodule update
Submodule path 'agent': checked out '2dccd6c2310615f34091e5158535e2fc808cefdb'
git pull
Already up to date.
make secret
Choose a secret type to update:
1) AWS Secrets Manager
2) Kubernetes Configmap and Secret
3) Clean local secrets cache
4) Provide an AI Key
#? 2

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".
 ➜ Creating configmap and secret ...
 ➜ Create configmap babel-infra-config for namespace babel-system ...
diff -N - /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/LIVE-2865684969/v1.ConfigMap.babel-system.babel-infra-config /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/MERGED-1872469164/v1.ConfigMap.babel-system.babel-infra-config
--- /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/LIVE-2865684969/v1.ConfigMap.babel-system.babel-infra-config	2024-10-06 16:04:50
+++ /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/MERGED-1872469164/v1.ConfigMap.babel-system.babel-infra-config	2024-10-06 16:04:50
@@ -38,6 +38,7 @@
   stripe.payment_price_id: price_1PESoORpiF8wNLazjWecz4eU
   stripe.sub_coupon_id: wW0vJdrJ
   stripe.sub_price_id: price_1PESooRpiF8wNLazPtHyLXbK
+  ut_agent_github_app_id: "1003394"
 kind: ConfigMap
 metadata:
   annotations:
Do you want to apply these changes? (Y/n) y
y
configmap/babel-infra-config configured
configmap/babel-infra-config not labeled
 ➜ Create secret babel-infra-secret for namespace babel-system ...
diff -N - /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/LIVE-1950723266/v1.Secret.babel-system.babel-infra-secret /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/MERGED-801295016/v1.Secret.babel-system.babel-infra-secret
--- /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/LIVE-1950723266/v1.Secret.babel-system.babel-infra-secret	2024-10-06 16:04:59
+++ /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/MERGED-801295016/v1.Secret.babel-system.babel-infra-secret	2024-10-06 16:04:59
@@ -34,6 +34,8 @@
   swe_bench.ecr.access_key_id: '***'
   swe_bench.ecr.secret_access_key: '***'
   swe_rag_token: '***'
+  ut_agent_github_app_private_key: '***'
+  ut_agent_github_app_webhook_secret: '***'
 kind: Secret
 metadata:
   annotations:
Do you want to apply these changes? (Y/n) y
y
secret/babel-infra-secret configured
secret/babel-infra-secret not labeled
 ➜ Create configmap babel-infra-config for namespace babel-ops ...
diff -N - /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/LIVE-1865692199/v1.ConfigMap.babel-ops.babel-infra-config /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/MERGED-4146183811/v1.ConfigMap.babel-ops.babel-infra-config
--- /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/LIVE-1865692199/v1.ConfigMap.babel-ops.babel-infra-config	2024-10-06 16:05:03
+++ /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/MERGED-4146183811/v1.ConfigMap.babel-ops.babel-infra-config	2024-10-06 16:05:03
@@ -38,6 +38,7 @@
   stripe.payment_price_id: price_1PESoORpiF8wNLazjWecz4eU
   stripe.sub_coupon_id: wW0vJdrJ
   stripe.sub_price_id: price_1PESooRpiF8wNLazPtHyLXbK
+  ut_agent_github_app_id: "1003394"
 kind: ConfigMap
 metadata:
   annotations:
Do you want to apply these changes? (Y/n) y
y
configmap/babel-infra-config configured
configmap/babel-infra-config not labeled
 ➜ Create secret babel-infra-secret for namespace babel-ops ...
diff -N - /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/LIVE-2674648548/v1.Secret.babel-ops.babel-infra-secret /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/MERGED-775835574/v1.Secret.babel-ops.babel-infra-secret
--- /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/LIVE-2674648548/v1.Secret.babel-ops.babel-infra-secret	2024-10-06 16:05:05
+++ /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/MERGED-775835574/v1.Secret.babel-ops.babel-infra-secret	2024-10-06 16:05:05
@@ -34,6 +34,8 @@
   swe_bench.ecr.access_key_id: '***'
   swe_bench.ecr.secret_access_key: '***'
   swe_rag_token: '***'
+  ut_agent_github_app_private_key: '***'
+  ut_agent_github_app_webhook_secret: '***'
 kind: Secret
 metadata:
   annotations:
Do you want to apply these changes? (Y/n) y
y
secret/babel-infra-secret configured
secret/babel-infra-secret not labeled
 ➜ Create secret babel-oauth-secret...
secret/babel-oauth-secret not labeled
 ➜ Create secret regcred...
secret/regcred configured
secret/regcred configured
 ➜ Create secret babel-runtime-webhook-issuer-keypair...
 ✔ Created configmap and secret, elapsed 24.884s
kukubectl set env deployment/babel-ai-proxy DEFAULT_KEY_PROVIDER=OpenAI -n babel-system

deployment.apps/babel-ai-proxy env updated
kubectl set env deployment/babel-ai-proxy DEFAULT_KEY_PROVIDER=OpenAI -n babel-system --kubeconfig kind-babelcloud
error: stat kind-babelcloud: no such file or directory
kubectl config current-context
kind-babelcloud
kubectl set env deployment/babel-ai-proxy DEFAULT_KEY_PROVIDER=OpenAI -n babel-system --kubeconfig kind-babelcloud
error: stat kind-babelcloud: no such file or directory
git pull
remote: Enumerating objects: 5, done.
remote: Counting objects: 100% (5/5), done.
remote: Compressing objects: 100% (3/3), done.
remote: Total 4 (delta 2), reused 3 (delta 1), pack-reused 0 (from 0)
Unpacking objects: 100% (4/4), 549 bytes | 183.00 KiB/s, done.
From github.com:babelcloud/babel-umbrella
   5eaa276..8da7d20  main       -> origin/main
Fetching submodule agent
From github.com:babelcloud/babel-agent
 + e057a45...b044503 hailong/testgru-improve -> origin/hailong/testgru-improve  (forced update)
   2dccd6c..957db02  main                    -> origin/main
Updating 5eaa276..8da7d20
Fast-forward
 agent | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
git pull
remote: Enumerating objects: 3, done.
remote: Counting objects: 100% (3/3), done.
remote: Compressing objects: 100% (1/1), done.
remote: Total 2 (delta 1), reused 2 (delta 1), pack-reused 0 (from 0)
Unpacking objects: 100% (2/2), 276 bytes | 276.00 KiB/s, done.
From github.com:babelcloud/babel-umbrella
   8da7d20..fef8ef0  main       -> origin/main
Fetching submodule agent
From github.com:babelcloud/babel-agent
 * [new branch]      cxz/refactor/unit-tester -> origin/cxz/refactor/unit-tester
   957db02..f09b608  main       -> origin/main
Updating 8da7d20..fef8ef0
Fast-forward
 agent | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
git submodule update
Submodule path 'agent': checked out 'f09b608256851613bbd31e2d86db25d0bf9b6874'
make secret
Choose a secret type to update:
1) AWS Secrets Manager
2) Kubernetes Configmap and Secret
3) Clean local secrets cache
4) Provide an AI Key
#? 2

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".
 ➜ Creating configmap and secret ...
 ➜ Create configmap babel-infra-config for namespace babel-system ...
configmap/babel-infra-config not labeled
 ➜ Create secret babel-infra-secret for namespace babel-system ...
secret/babel-infra-secret not labeled
 ➜ Create configmap babel-infra-config for namespace babel-ops ...
configmap/babel-infra-config not labeled
 ➜ Create secret babel-infra-secret for namespace babel-ops ...
secret/babel-infra-secret not labeled
 ➜ Create secret babel-oauth-secret...
secret/babel-oauth-secret not labeled
 ➜ Create secret regcred...
secret/regcred configured
secret/regcred configured
 ➜ Create secret babel-runtime-webhook-issuer-keypair...
 ✔ Created configmap and secret, elapsed 4.451s
make install-app
Services run locally: agent

 ✔ Preload service images, elapsed 0.571s
Target cluster 'https://0.0.0.0:40180' (nodes: babelcloud-control-plane)

@@ update deployment/babel-agent (apps/v1) namespace: babel-system @@
  ...
499,499   spec:
500     -   progressDeadlineSeconds: 600
501,500     replicas: 0
502     -   revisionHistoryLimit: 10
503,501     selector:
504,502       matchLabels:
  ...
506,504         module: babel-agent
507     -   strategy:
508     -     rollingUpdate:
509     -       maxSurge: 25%
510     -       maxUnavailable: 25%
511     -     type: RollingUpdate
512,505     template:
513,506       metadata:
514     -       creationTimestamp: null
515,507         labels:
516,508           kapp.k14s.io/app: "1721490507501923000"
  ...
625,617           - name: NODE_OPTIONS
    618 +           value: ""
626,619           - name: USAGE_API_HOST
627,620             value: http://babel-controller.babel-system.svc.cluster.local:80
  ...
676,669           - name: SANDBOX_NODE_GROUP
    670 +           value: ""
677,671           - name: AI_PROXY_ENDPOINT
678,672             value: http://babel-ai-proxy:3007
  ...
751,745                 name: babel-infra-secret
752     -         - name: STAKATER_BABEL_INFRA_CONFIG_CONFIGMAP
753     -           value: 3bb3b42cf28f36f1882b10d49962202a9cb1afa6
754     -         - name: STAKATER_BABEL_INFRA_SECRET_SECRET
755     -           value: fb2999135b23c56a802fdb962848d199f790e5f7
756     -         image: ghcr.io/babelcloud/babel-agent:b45b91b
    746 +         image: ghcr.io/babelcloud/babel-agent:f09b608
757,747           imagePullPolicy: IfNotPresent
758,748           livenessProbe:
  ...
761,751             periodSeconds: 10
762     -           successThreshold: 1
763,752             tcpSocket:
764,753               port: 8083
  ...
770,759             periodSeconds: 10
771     -           successThreshold: 1
772,760             tcpSocket:
773,761               port: 8083
774,762             timeoutSeconds: 3
775     -         resources: {}
776     -         terminationMessagePath: /dev/termination-log
777     -         terminationMessagePolicy: File
778,763           volumeMounts:
779,764           - mountPath: /var/cache/babel-agent/langchain
780,765             name: langchain-cache
781     -       dnsPolicy: ClusterFirst
782,766         imagePullSecrets:
783,767         - name: regcred
784     -       restartPolicy: Always
785     -       schedulerName: default-scheduler
786     -       securityContext: {}
787     -       serviceAccount: babel-agent
    768 +       nodeSelector: null
788,769         serviceAccountName: babel-agent
789     -       terminationGracePeriodSeconds: 30
790,770         volumes:
791,771         - name: langchain-cache
@@ update deployment/babel-ai-proxy (apps/v1) namespace: babel-system @@
  ...
271,271   spec:
272     -   progressDeadlineSeconds: 600
273,272     replicas: 1
274     -   revisionHistoryLimit: 10
275,273     selector:
276,274       matchLabels:
  ...
278,276         module: babel-ai-proxy
279     -   strategy:
280     -     rollingUpdate:
281     -       maxSurge: 25%
282     -       maxUnavailable: 25%
283     -     type: RollingUpdate
284,277     template:
285,278       metadata:
286     -       creationTimestamp: null
287,279         labels:
288,280           kapp.k14s.io/app: "1721490507501923000"
  ...
321,313           - name: DEFAULT_KEY_PROVIDER
322     -           value: OpenAI
    314 +           value: Azure
323,315           - name: RABBITMQ_USERNAME
324,316             valueFrom:
  ...
358,350           - name: NODE_OPTIONS
359     -         - name: STAKATER_BABEL_INFRA_CONFIG_CONFIGMAP
360     -           value: 3bb3b42cf28f36f1882b10d49962202a9cb1afa6
361     -         - name: STAKATER_BABEL_INFRA_SECRET_SECRET
362     -           value: fb2999135b23c56a802fdb962848d199f790e5f7
    351 +           value: ""
363,352           image: ghcr.io/babelcloud/babel-ai-proxy:c41650e
364,353           imagePullPolicy: IfNotPresent
  ...
368,357             periodSeconds: 10
369     -           successThreshold: 1
370,358             tcpSocket:
371,359               port: 3007
  ...
377,365             periodSeconds: 10
378     -           successThreshold: 1
379,366             tcpSocket:
380,367               port: 3007
381,368             timeoutSeconds: 3
382     -         resources: {}
383     -         terminationMessagePath: /dev/termination-log
384     -         terminationMessagePolicy: File
385     -       dnsPolicy: ClusterFirst
386,369         imagePullSecrets:
387,370         - name: regcred
388     -       restartPolicy: Always
389     -       schedulerName: default-scheduler
390     -       securityContext: {}
391     -       terminationGracePeriodSeconds: 30
    371 +       nodeSelector: null
392,372
@@ update deployment/babel-controller (apps/v1) namespace: babel-system @@
  ...
540,540   spec:
541     -   progressDeadlineSeconds: 600
542,541     replicas: 1
543     -   revisionHistoryLimit: 10
544,542     selector:
545,543       matchLabels:
  ...
547,545         module: babel-controller
548     -   strategy:
549     -     rollingUpdate:
550     -       maxSurge: 25%
551     -       maxUnavailable: 25%
552     -     type: RollingUpdate
553,546     template:
554,547       metadata:
555     -       creationTimestamp: null
556,548         labels:
557,549           kapp.k14s.io/app: "1721490507501923000"
  ...
563,555           - name: BABELCLOUD_REVISION
564     -           value: 9fc9c103fba53d72268e4850e0823cd4ed61e435
    556 +           value: fef8ef04af6b0e882c4525136fcfbb3e7b4baab8
565,557           - name: BABELCLOUD_ENVIRONMENT
566,558             valueFrom:
  ...
680,672           - name: BABELCLOUD_RUNTIME_NODE_GROUP
    673 +           value: ""
681,674           - name: BABELCLOUD_RUNTIME_OPENAI_PROXY
682,675             valueFrom:
  ...
802,795           - name: STRIPE_PAYMENT_COUPON_ID
    796 +           value: ""
803,797           - name: STRIPE_SUB_COUPON_ID
    798 +           value: ""
804,799           - name: STRIPE_ENABLE_WECHAT
805,800             value: "false"
  ...
807,802             value: "false"
808     -         - name: STAKATER_BABEL_INFRA_CONFIG_CONFIGMAP
809     -           value: 3bb3b42cf28f36f1882b10d49962202a9cb1afa6
810     -         - name: STAKATER_BABEL_INFRA_SECRET_SECRET
811     -           value: fb2999135b23c56a802fdb962848d199f790e5f7
812,803           image: ghcr.io/babelcloud/babel-controller:e6be1d5
813,804           imagePullPolicy: IfNotPresent
  ...
817,808             periodSeconds: 10
818     -           successThreshold: 1
819,809             tcpSocket:
820,810               port: 8080
  ...
826,816             periodSeconds: 10
827     -           successThreshold: 1
828,817             tcpSocket:
829,818               port: 8080
830,819             timeoutSeconds: 3
831     -         resources: {}
832     -         terminationMessagePath: /dev/termination-log
833     -         terminationMessagePolicy: File
834,820           volumeMounts:
835,821           - mountPath: /opentelemetry
  ...
837,823             readOnly: true
838     -       dnsPolicy: ClusterFirst
839,824         imagePullSecrets:
840,825         - name: regcred
  ...
848,833           name: install-opentelemetry-java-agent
849     -         resources: {}
850     -         terminationMessagePath: /dev/termination-log
851     -         terminationMessagePolicy: File
852,834           volumeMounts:
853,835           - mountPath: /opentelemetry
854,836             name: opentelemetry
855     -       restartPolicy: Always
856     -       schedulerName: default-scheduler
857     -       securityContext: {}
858     -       serviceAccount: babel-controller
    837 +       nodeSelector: null
859,838         serviceAccountName: babel-controller
860     -       terminationGracePeriodSeconds: 30
861,839         volumes:
862,840         - emptyDir: {}
@@ update deployment/babel-history (apps/v1) namespace: babel-system @@
  ...
190,190   spec:
191     -   progressDeadlineSeconds: 600
192,191     replicas: 1
193     -   revisionHistoryLimit: 10
194,192     selector:
195,193       matchLabels:
  ...
197,195         module: babel-history
198     -   strategy:
199     -     rollingUpdate:
200     -       maxSurge: 25%
201     -       maxUnavailable: 25%
202     -     type: RollingUpdate
203,196     template:
204,197       metadata:
205     -       creationTimestamp: null
206,198         labels:
207,199           kapp.k14s.io/app: "1721490507501923000"
  ...
230,222             value: babel-history
231     -         - name: STAKATER_BABEL_INFRA_CONFIG_CONFIGMAP
232     -           value: 3bb3b42cf28f36f1882b10d49962202a9cb1afa6
233,223           image: ghcr.io/babelcloud/babel-history:72ec027
234,224           imagePullPolicy: IfNotPresent
  ...
238,228             periodSeconds: 10
239     -           successThreshold: 1
240,229             tcpSocket:
241,230               port: 18080
  ...
247,236             periodSeconds: 10
248     -           successThreshold: 1
249,237             tcpSocket:
250,238               port: 18080
251,239             timeoutSeconds: 3
252     -         resources: {}
253     -         terminationMessagePath: /dev/termination-log
254     -         terminationMessagePolicy: File
255,240           volumeMounts:
256,241           - mountPath: /repo
257,242             name: repo
258     -       dnsPolicy: ClusterFirst
259,243         imagePullSecrets:
260,244         - name: regcred
261     -       restartPolicy: Always
262     -       schedulerName: default-scheduler
263     -       securityContext: {}
264     -       terminationGracePeriodSeconds: 30
    245 +       nodeSelector: null
265,246         volumes:
266,247         - name: repo
@@ update deployment/babel-observ (apps/v1) namespace: babel-system @@
  ...
183,183   spec:
184     -   progressDeadlineSeconds: 600
185,184     replicas: 1
186     -   revisionHistoryLimit: 10
187,185     selector:
188,186       matchLabels:
  ...
190,188         module: babel-observ
191     -   strategy:
192     -     rollingUpdate:
193     -       maxSurge: 25%
194     -       maxUnavailable: 25%
195     -     type: RollingUpdate
196,189     template:
197,190       metadata:
198     -       creationTimestamp: null
199,191         labels:
200,192           kapp.k14s.io/app: "1721490507501923000"
  ...
222,214             value: http://datakit-service.datakit:9529
223     -         - name: STAKATER_BABEL_INFRA_CONFIG_CONFIGMAP
224     -           value: 3bb3b42cf28f36f1882b10d49962202a9cb1afa6
225,215           image: ghcr.io/babelcloud/babel-observ:6ec92ae
226,216           imagePullPolicy: IfNotPresent
  ...
230,220             periodSeconds: 10
231     -           successThreshold: 1
232,221             tcpSocket:
233,222               port: 3005
  ...
239,228             periodSeconds: 10
240     -           successThreshold: 1
241,229             tcpSocket:
242,230               port: 3005
243,231             timeoutSeconds: 3
244     -         resources: {}
245     -         terminationMessagePath: /dev/termination-log
246     -         terminationMessagePolicy: File
247     -       dnsPolicy: ClusterFirst
248,232         imagePullSecrets:
249,233         - name: regcred
250     -       restartPolicy: Always
251     -       schedulerName: default-scheduler
252     -       securityContext: {}
253     -       terminationGracePeriodSeconds: 30
    234 +       nodeSelector: null
254,235
@@ update deployment/babel-storage (apps/v1) namespace: babel-system @@
  ...
296,296   spec:
297     -   progressDeadlineSeconds: 600
298,297     replicas: 1
299     -   revisionHistoryLimit: 10
300,298     selector:
301,299       matchLabels:
  ...
303,301         module: babel-storage
304     -   strategy:
305     -     rollingUpdate:
306     -       maxSurge: 25%
307     -       maxUnavailable: 25%
308     -     type: RollingUpdate
309,302     template:
310,303       metadata:
311     -       creationTimestamp: null
312,304         labels:
313,305           kapp.k14s.io/app: "1721490507501923000"
  ...
404,396           - name: NODE_OPTIONS
405     -         - name: STAKATER_BABEL_INFRA_CONFIG_CONFIGMAP
406     -           value: 3bb3b42cf28f36f1882b10d49962202a9cb1afa6
407     -         - name: STAKATER_BABEL_INFRA_SECRET_SECRET
408     -           value: fb2999135b23c56a802fdb962848d199f790e5f7
    397 +           value: ""
409,398           image: ghcr.io/babelcloud/babel-storage:d092ae8
410,399           imagePullPolicy: IfNotPresent
  ...
414,403             periodSeconds: 10
415     -           successThreshold: 1
416,404             tcpSocket:
417,405               port: 4003
  ...
423,411             periodSeconds: 10
424     -           successThreshold: 1
425,412             tcpSocket:
426,413               port: 4003
427,414             timeoutSeconds: 3
428     -         resources: {}
429     -         terminationMessagePath: /dev/termination-log
430     -         terminationMessagePolicy: File
431     -       dnsPolicy: ClusterFirst
432,415         imagePullSecrets:
433,416         - name: regcred
434     -       restartPolicy: Always
435     -       schedulerName: default-scheduler
436     -       securityContext: {}
437     -       terminationGracePeriodSeconds: 30
    417 +       nodeSelector: null
438,418
@@ update service/babel-toolbox (v1) namespace: babel-tenant @@
  ...
  2,  2   metadata:
  3     -   annotations: {}
  4,  3     creationTimestamp: "2024-07-20T15:48:28Z"
  5,  4     labels:
  ...
 54, 53     clusterIP: 10.96.141.65
 55     -   clusterIPs:
 56     -   - 10.96.141.65
 57     -   internalTrafficPolicy: Cluster
 58     -   ipFamilies:
 59     -   - IPv4
 60     -   ipFamilyPolicy: SingleStack
 61, 54     ports:
 62     -   - name: port0
 63     -     port: 3010
 64     -     protocol: TCP
 65     -     targetPort: 39441
     55 +   - port: 3010
 66, 56     selector:
 67     -     kwt.cppforlife.com/net: "true"
 68     -   sessionAffinity: None
     57 +     kapp.k14s.io/app: "1721490507501923000"
     58 +     module: babel-toolbox
 69, 59     type: ClusterIP
 70, 60
@@ update deployment/babel-vectorstore (apps/v1) namespace: babel-system @@
  ...
256,256   spec:
257     -   progressDeadlineSeconds: 600
258,257     replicas: 1
259     -   revisionHistoryLimit: 10
260,258     selector:
261,259       matchLabels:
  ...
263,261         module: babel-vectorstore
264     -   strategy:
265     -     rollingUpdate:
266     -       maxSurge: 25%
267     -       maxUnavailable: 25%
268     -     type: RollingUpdate
269,262     template:
270,263       metadata:
271     -       creationTimestamp: null
272,264         labels:
273,265           kapp.k14s.io/app: "1721490507501923000"
  ...
331,323           - name: NODE_OPTIONS
    324 +           value: ""
332,325           - name: OPENAI_PROXY
333,326             valueFrom:
  ...
336,329                 name: babel-infra-secret
337     -         - name: STAKATER_BABEL_INFRA_CONFIG_CONFIGMAP
338     -           value: 3bb3b42cf28f36f1882b10d49962202a9cb1afa6
339     -         - name: STAKATER_BABEL_INFRA_SECRET_SECRET
340     -           value: fb2999135b23c56a802fdb962848d199f790e5f7
341,330           image: ghcr.io/babelcloud/babel-vectorstore:8e9fbc7
342,331           imagePullPolicy: IfNotPresent
  ...
346,335             periodSeconds: 10
347     -           successThreshold: 1
348,336             tcpSocket:
349,337               port: 4006
  ...
355,343             periodSeconds: 10
356     -           successThreshold: 1
357,344             tcpSocket:
358,345               port: 4006
359,346             timeoutSeconds: 3
360     -         resources: {}
361     -         terminationMessagePath: /dev/termination-log
362     -         terminationMessagePolicy: File
363     -       dnsPolicy: ClusterFirst
364,347         imagePullSecrets:
365,348         - name: regcred
366     -       restartPolicy: Always
367     -       schedulerName: default-scheduler
368     -       securityContext: {}
369     -       terminationGracePeriodSeconds: 30
    349 +       nodeSelector: null
370,350

Changes

Namespace     Name               Kind        Age  Op      Op st.  Wait to    Rs  Ri
babel-system  babel-agent        Deployment  79d  update  -       reconcile  ok  -
^             babel-ai-proxy     Deployment  79d  update  -       reconcile  ok  -
^             babel-controller   Deployment  79d  update  -       reconcile  ok  -
^             babel-history      Deployment  79d  update  -       reconcile  ok  -
^             babel-observ       Deployment  79d  update  -       reconcile  ok  -
^             babel-storage      Deployment  79d  update  -       reconcile  ok  -
^             babel-vectorstore  Deployment  79d  update  -       reconcile  ok  -
babel-tenant  babel-toolbox      Service     79d  update  -       reconcile  ok  -

Op:      0 create, 0 delete, 8 update, 0 noop, 0 exists
Wait to: 8 reconcile, 0 delete, 0 noop

10:33:50AM: ---- applying 6 changes [0/8 done] ----
10:33:50AM: update service/babel-toolbox (v1) namespace: babel-tenant
10:33:50AM: update deployment/babel-observ (apps/v1) namespace: babel-system
10:33:50AM: update deployment/babel-vectorstore (apps/v1) namespace: babel-system
10:33:50AM: update deployment/babel-ai-proxy (apps/v1) namespace: babel-system
10:33:50AM: update deployment/babel-storage (apps/v1) namespace: babel-system
10:33:50AM: update deployment/babel-history (apps/v1) namespace: babel-system
10:33:50AM: ---- waiting on 6 changes [0/8 done] ----
10:33:50AM: ok: reconcile service/babel-toolbox (v1) namespace: babel-tenant
10:33:50AM: ongoing: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
10:33:50AM:  ^ Waiting for generation 27 to be observed
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-f77d895f (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-f4fb44f78 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-cdbf94b64 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-c4bbf9b54 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-847ffd96f4 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-778f85595 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-6667cb9cc5 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-64fd6dc7c8 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-594ddc876b (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-59465748f9 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-584475f79f (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on pod/babel-ai-proxy-59465748f9-4r476 (v1) namespace: babel-system
10:33:50AM: ongoing: reconcile deployment/babel-history (apps/v1) namespace: babel-system
10:33:50AM:  ^ Waiting for generation 10 to be observed
10:33:50AM:  L ok: waiting on replicaset/babel-history-7c57b4cf49 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-history-7988dc4ffc (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-history-76b97d9cdb (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-history-54657b5cdd (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on pod/babel-history-7988dc4ffc-qxwck (v1) namespace: babel-system
10:33:50AM: ongoing: reconcile deployment/babel-observ (apps/v1) namespace: babel-system
10:33:50AM:  ^ Waiting for generation 8 to be observed
10:33:50AM:  L ok: waiting on replicaset/babel-observ-6748c4db98 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-observ-5f6958659d (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-observ-5d4b864bbc (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on pod/babel-observ-6748c4db98-zwkxv (v1) namespace: babel-system
10:33:50AM: ongoing: reconcile deployment/babel-vectorstore (apps/v1) namespace: babel-system
10:33:50AM:  ^ Waiting for generation 16 to be observed
10:33:50AM:  L ok: waiting on replicaset/babel-vectorstore-d7f6ddb49 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-vectorstore-7f79466dd8 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-vectorstore-7c466df6f6 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-vectorstore-77d47585b4 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-vectorstore-6fb88bf7f6 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-vectorstore-6d6686d54d (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-vectorstore-55fc8bd749 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-vectorstore-55d96b7c7 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on pod/babel-vectorstore-6d6686d54d-klq9q (v1) namespace: babel-system
10:33:50AM: ongoing: reconcile deployment/babel-storage (apps/v1) namespace: babel-system
10:33:50AM:  ^ Waiting for generation 16 to be observed
10:33:50AM:  L ok: waiting on replicaset/babel-storage-8bd4d9577 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-storage-7fc4c585d9 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-storage-78d94d795b (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-storage-78498bfd6d (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-storage-68f8456544 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-storage-5d6f4bc668 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-storage-576bd799f4 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-storage-55c864bcc (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on pod/babel-storage-68f8456544-b8c2v (v1) namespace: babel-system
10:33:50AM: ---- waiting on 5 changes [1/8 done] ----
10:33:50AM: ongoing: reconcile deployment/babel-history (apps/v1) namespace: babel-system
10:33:50AM:  ^ Waiting for 1 unavailable replicas
10:33:50AM:  L ok: waiting on replicaset/babel-history-7c57b4cf49 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-history-7988dc4ffc (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-history-76b97d9cdb (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-history-54657b5cdd (apps/v1) namespace: babel-system
10:33:50AM:  L ongoing: waiting on pod/babel-history-7c57b4cf49-9k2dd (v1) namespace: babel-system
10:33:50AM:     ^ Pending
10:33:50AM:  L ok: waiting on pod/babel-history-7988dc4ffc-qxwck (v1) namespace: babel-system
10:33:50AM: ongoing: reconcile deployment/babel-storage (apps/v1) namespace: babel-system
10:33:50AM:  ^ Waiting for generation 16 to be observed
10:33:50AM:  L ok: waiting on replicaset/babel-storage-8bd4d9577 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-storage-7fc4c585d9 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-storage-78d94d795b (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-storage-78498bfd6d (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-storage-68f8456544 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-storage-5d6f4bc668 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-storage-576bd799f4 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-storage-55c864bcc (apps/v1) namespace: babel-system
10:33:50AM:  L ongoing: waiting on pod/babel-storage-8bd4d9577-flvcg (v1) namespace: babel-system
10:33:50AM:     ^ Pending
10:33:50AM:  L ok: waiting on pod/babel-storage-68f8456544-b8c2v (v1) namespace: babel-system
10:33:50AM: ongoing: reconcile deployment/babel-observ (apps/v1) namespace: babel-system
10:33:50AM:  ^ Waiting for generation 8 to be observed
10:33:50AM:  L ok: waiting on replicaset/babel-observ-6748c4db98 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-observ-5f6958659d (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-observ-5d4b864bbc (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on pod/babel-observ-6748c4db98-zwkxv (v1) namespace: babel-system
10:33:50AM:  L ongoing: waiting on pod/babel-observ-5f6958659d-4m56p (v1) namespace: babel-system
10:33:50AM:     ^ Pending
10:33:50AM: ongoing: reconcile deployment/babel-vectorstore (apps/v1) namespace: babel-system
10:33:50AM:  ^ Waiting for 1 unavailable replicas
10:33:50AM:  L ok: waiting on replicaset/babel-vectorstore-d7f6ddb49 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-vectorstore-7f79466dd8 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-vectorstore-7c466df6f6 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-vectorstore-77d47585b4 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-vectorstore-6fb88bf7f6 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-vectorstore-6d6686d54d (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-vectorstore-55fc8bd749 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-vectorstore-55d96b7c7 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on pod/babel-vectorstore-6d6686d54d-klq9q (v1) namespace: babel-system
10:33:50AM:  L ongoing: waiting on pod/babel-vectorstore-55d96b7c7-mtstd (v1) namespace: babel-system
10:33:50AM:     ^ Pending
10:33:50AM: ongoing: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
10:33:50AM:  ^ Waiting for generation 27 to be observed
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-f77d895f (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-f4fb44f78 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-cdbf94b64 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-c4bbf9b54 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-847ffd96f4 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-778f85595 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-6667cb9cc5 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-64fd6dc7c8 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-594ddc876b (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-59465748f9 (apps/v1) namespace: babel-system
10:33:50AM:  L ok: waiting on replicaset/babel-ai-proxy-584475f79f (apps/v1) namespace: babel-system
10:33:50AM:  L ongoing: waiting on pod/babel-ai-proxy-778f85595-9s8mq (v1) namespace: babel-system
10:33:50AM:     ^ Pending
10:33:50AM:  L ok: waiting on pod/babel-ai-proxy-59465748f9-4r476 (v1) namespace: babel-system
10:33:53AM: ongoing: reconcile deployment/babel-observ (apps/v1) namespace: babel-system
10:33:53AM:  ^ Waiting for 1 unavailable replicas
10:33:53AM:  L ok: waiting on replicaset/babel-observ-6748c4db98 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-observ-5f6958659d (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-observ-5d4b864bbc (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on pod/babel-observ-6748c4db98-zwkxv (v1) namespace: babel-system
10:33:53AM:  L ongoing: waiting on pod/babel-observ-5f6958659d-4m56p (v1) namespace: babel-system
10:33:53AM:     ^ Condition Ready is not True (False)
10:33:53AM: ongoing: reconcile deployment/babel-history (apps/v1) namespace: babel-system
10:33:53AM:  ^ Waiting for 1 unavailable replicas
10:33:53AM:  L ok: waiting on replicaset/babel-history-7c57b4cf49 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-history-7988dc4ffc (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-history-76b97d9cdb (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-history-54657b5cdd (apps/v1) namespace: babel-system
10:33:53AM:  L ongoing: waiting on pod/babel-history-7c57b4cf49-9k2dd (v1) namespace: babel-system
10:33:53AM:     ^ Condition Ready is not True (False)
10:33:53AM:  L ok: waiting on pod/babel-history-7988dc4ffc-qxwck (v1) namespace: babel-system
10:33:53AM: ongoing: reconcile deployment/babel-vectorstore (apps/v1) namespace: babel-system
10:33:53AM:  ^ Waiting for 1 unavailable replicas
10:33:53AM:  L ok: waiting on replicaset/babel-vectorstore-d7f6ddb49 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-vectorstore-7f79466dd8 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-vectorstore-7c466df6f6 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-vectorstore-77d47585b4 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-vectorstore-6fb88bf7f6 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-vectorstore-6d6686d54d (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-vectorstore-55fc8bd749 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-vectorstore-55d96b7c7 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on pod/babel-vectorstore-6d6686d54d-klq9q (v1) namespace: babel-system
10:33:53AM:  L ongoing: waiting on pod/babel-vectorstore-55d96b7c7-mtstd (v1) namespace: babel-system
10:33:53AM:     ^ Condition Ready is not True (False)
10:33:53AM: ongoing: reconcile deployment/babel-storage (apps/v1) namespace: babel-system
10:33:53AM:  ^ Waiting for 1 unavailable replicas
10:33:53AM:  L ok: waiting on replicaset/babel-storage-8bd4d9577 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-storage-7fc4c585d9 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-storage-78d94d795b (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-storage-78498bfd6d (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-storage-68f8456544 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-storage-5d6f4bc668 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-storage-576bd799f4 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-storage-55c864bcc (apps/v1) namespace: babel-system
10:33:53AM:  L ongoing: waiting on pod/babel-storage-8bd4d9577-flvcg (v1) namespace: babel-system
10:33:53AM:     ^ Condition Ready is not True (False)
10:33:53AM:  L ok: waiting on pod/babel-storage-68f8456544-b8c2v (v1) namespace: babel-system
10:33:53AM: ongoing: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
10:33:53AM:  ^ Waiting for 1 unavailable replicas
10:33:53AM:  L ok: waiting on replicaset/babel-ai-proxy-f77d895f (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-ai-proxy-f4fb44f78 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-ai-proxy-cdbf94b64 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-ai-proxy-c4bbf9b54 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-ai-proxy-847ffd96f4 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-ai-proxy-778f85595 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-ai-proxy-6667cb9cc5 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-ai-proxy-64fd6dc7c8 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-ai-proxy-594ddc876b (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-ai-proxy-59465748f9 (apps/v1) namespace: babel-system
10:33:53AM:  L ok: waiting on replicaset/babel-ai-proxy-584475f79f (apps/v1) namespace: babel-system
10:33:53AM:  L ongoing: waiting on pod/babel-ai-proxy-778f85595-9s8mq (v1) namespace: babel-system
10:33:53AM:     ^ Condition Ready is not True (False)
10:33:53AM:  L ok: waiting on pod/babel-ai-proxy-59465748f9-4r476 (v1) namespace: babel-system
10:34:03AM: ok: reconcile deployment/babel-observ (apps/v1) namespace: babel-system
10:34:03AM: ok: reconcile deployment/babel-history (apps/v1) namespace: babel-system
10:34:03AM: ok: reconcile deployment/babel-storage (apps/v1) namespace: babel-system
10:34:03AM: ok: reconcile deployment/babel-vectorstore (apps/v1) namespace: babel-system
10:34:03AM: ok: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
10:34:03AM: ---- applying 1 changes [6/8 done] ----
10:34:04AM: update deployment/babel-agent (apps/v1) namespace: babel-system
10:34:04AM: ---- waiting on 1 changes [6/8 done] ----
10:34:04AM: ongoing: reconcile deployment/babel-agent (apps/v1) namespace: babel-system
10:34:04AM:  ^ Waiting for generation 66 to be observed
10:34:04AM:  L ok: waiting on replicaset/babel-agent-85f977c9cd (apps/v1) namespace: babel-system
10:34:04AM:  L ok: waiting on replicaset/babel-agent-85bcbc4d4 (apps/v1) namespace: babel-system
10:34:04AM:  L ok: waiting on replicaset/babel-agent-85b7978cb7 (apps/v1) namespace: babel-system
10:34:04AM:  L ok: waiting on replicaset/babel-agent-85b4578ddd (apps/v1) namespace: babel-system
10:34:04AM:  L ok: waiting on replicaset/babel-agent-7c667b954 (apps/v1) namespace: babel-system
10:34:04AM:  L ok: waiting on replicaset/babel-agent-764ddb747f (apps/v1) namespace: babel-system
10:34:04AM:  L ok: waiting on replicaset/babel-agent-6f9c9dbdcb (apps/v1) namespace: babel-system
10:34:04AM:  L ok: waiting on replicaset/babel-agent-6c5bb948dc (apps/v1) namespace: babel-system
10:34:04AM:  L ok: waiting on replicaset/babel-agent-6567977887 (apps/v1) namespace: babel-system
10:34:04AM:  L ok: waiting on replicaset/babel-agent-5cb47f8799 (apps/v1) namespace: babel-system
10:34:04AM:  L ok: waiting on replicaset/babel-agent-545b76cf8f (apps/v1) namespace: babel-system
10:34:07AM: ok: reconcile deployment/babel-agent (apps/v1) namespace: babel-system
10:34:07AM: ---- applying 1 changes [7/8 done] ----
10:34:08AM: update deployment/babel-controller (apps/v1) namespace: babel-system
10:34:08AM: ---- waiting on 1 changes [7/8 done] ----
10:34:08AM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
10:34:08AM:  ^ Waiting for generation 70 to be observed
10:34:08AM:  L ok: waiting on replicaset/babel-controller-f966bf8f8 (apps/v1) namespace: babel-system
10:34:08AM:  L ok: waiting on replicaset/babel-controller-cb646cbdd (apps/v1) namespace: babel-system
10:34:08AM:  L ok: waiting on replicaset/babel-controller-9bfb8787b (apps/v1) namespace: babel-system
10:34:08AM:  L ok: waiting on replicaset/babel-controller-7f4678b6 (apps/v1) namespace: babel-system
10:34:08AM:  L ok: waiting on replicaset/babel-controller-7c66594978 (apps/v1) namespace: babel-system
10:34:08AM:  L ok: waiting on replicaset/babel-controller-795bfc48fc (apps/v1) namespace: babel-system
10:34:08AM:  L ok: waiting on replicaset/babel-controller-6fb6456c86 (apps/v1) namespace: babel-system
10:34:08AM:  L ok: waiting on replicaset/babel-controller-6b5fb485bc (apps/v1) namespace: babel-system
10:34:08AM:  L ok: waiting on replicaset/babel-controller-68cf94ff85 (apps/v1) namespace: babel-system
10:34:08AM:  L ok: waiting on replicaset/babel-controller-6789b45f9d (apps/v1) namespace: babel-system
10:34:08AM:  L ok: waiting on replicaset/babel-controller-64f84fd89d (apps/v1) namespace: babel-system
10:34:08AM:  L ok: waiting on replicaset/babel-controller-5c6fcb94c (apps/v1) namespace: babel-system
10:34:08AM:  L ongoing: waiting on pod/babel-controller-68cf94ff85-nhs7c (v1) namespace: babel-system
10:34:08AM:     ^ Pending: PodInitializing
10:34:08AM:  L ok: waiting on pod/babel-controller-5c6fcb94c-r96f4 (v1) namespace: babel-system
10:34:11AM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
10:34:11AM:  ^ Waiting for 1 unavailable replicas
10:34:11AM:  L ok: waiting on replicaset/babel-controller-f966bf8f8 (apps/v1) namespace: babel-system
10:34:11AM:  L ok: waiting on replicaset/babel-controller-cb646cbdd (apps/v1) namespace: babel-system
10:34:11AM:  L ok: waiting on replicaset/babel-controller-9bfb8787b (apps/v1) namespace: babel-system
10:34:11AM:  L ok: waiting on replicaset/babel-controller-7f4678b6 (apps/v1) namespace: babel-system
10:34:11AM:  L ok: waiting on replicaset/babel-controller-7c66594978 (apps/v1) namespace: babel-system
10:34:11AM:  L ok: waiting on replicaset/babel-controller-795bfc48fc (apps/v1) namespace: babel-system
10:34:11AM:  L ok: waiting on replicaset/babel-controller-6fb6456c86 (apps/v1) namespace: babel-system
10:34:11AM:  L ok: waiting on replicaset/babel-controller-6b5fb485bc (apps/v1) namespace: babel-system
10:34:11AM:  L ok: waiting on replicaset/babel-controller-68cf94ff85 (apps/v1) namespace: babel-system
10:34:11AM:  L ok: waiting on replicaset/babel-controller-6789b45f9d (apps/v1) namespace: babel-system
10:34:11AM:  L ok: waiting on replicaset/babel-controller-64f84fd89d (apps/v1) namespace: babel-system
10:34:11AM:  L ok: waiting on replicaset/babel-controller-5c6fcb94c (apps/v1) namespace: babel-system
10:34:11AM:  L ongoing: waiting on pod/babel-controller-68cf94ff85-nhs7c (v1) namespace: babel-system
10:34:11AM:     ^ Condition Ready is not True (False)
10:34:11AM:  L ok: waiting on pod/babel-controller-5c6fcb94c-r96f4 (v1) namespace: babel-system
10:34:29AM: ok: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
10:34:29AM: ---- applying complete [8/8 done] ----
10:34:29AM: ---- waiting complete [8/8 done] ----
 ➜ Setup port forwarding...
Force restart or not running process found, clean-up kwt-net pod...
Clean-up krelay-server pod...
No proxy needed, you are outside the wall.
Stopping `supervisor`... (might take a while)
==> Successfully stopped `supervisor` (label: homebrew.mxcl.supervisor)
 ✔ Port forwarding completed, elapsed 8.118s
 ✔ Installed Babel App, elapsed 50.400s
kubectl set env deployment/babel-ai-proxy DEFAULT_KEY_PROVIDER=OpenAI -n babel-system
deployment.apps/babel-ai-proxy env updated
git pull
remote: Enumerating objects: 68, done.
remote: Counting objects: 100% (68/68), done.
remote: Compressing objects: 100% (34/34), done.
remote: Total 68 (delta 38), reused 57 (delta 31), pack-reused 0 (from 0)
Unpacking objects: 100% (68/68), 13.16 KiB | 224.00 KiB/s, done.
From github.com:babelcloud/babel-umbrella
   fef8ef0..af00478  main       -> origin/main
Fetching submodule agent
From github.com:babelcloud/babel-agent
   0968df0..8e48105  hax/unit-test-tss-tools -> origin/hax/unit-test-tss-tools
   f09b608..6576acc  main                    -> origin/main
 * [new branch]      vangie/fix-langsmith-broken-link -> origin/vangie/fix-langsmith-broken-link
 * [new branch]      zthreefires/handle-install-create-event -> origin/zthreefires/handle-install-create-event
Fetching submodule ai-proxy
From github.com:babelcloud/babel-ai-proxy
   c41650e..032500b  main       -> origin/main
 * [new branch]      mingshun/feat/integrate-vertex-ai -> origin/mingshun/feat/integrate-vertex-ai
 * [new branch]      vangie/adapt-azure-o1-models -> origin/vangie/adapt-azure-o1-models
Fetching submodule sandbox
From github.com:babelcloud/babel-sandbox
 + ea8b539...12aa8a5 hax/session-service -> origin/hax/session-service  (forced update)
 * [new branch]      hax/tss-tools       -> origin/hax/tss-tools
   2409d88..afa4c6e  main                -> origin/main
Updating fef8ef0..af00478
Fast-forward
 agent                                                                |  2 +-
 ai-proxy                                                             |  2 +-
 deploy/debug.sh                                                      | 10 +++++++++-
 deploy/init/openai/azure-founders-hub/input.tf                       |  2 ++
 deploy/init/openai/azure-founders-hub/modules/openai-service/main.tf | 55 +++++++++++++++++++++++++++++++++++++++++++++++--------
 deploy/init/openai/modules/openai-service/main.tf                    |  7 ++++---
 deploy/init/openai/update_azure_keys.sh                              |  2 +-
 deploy/local/scripts/install-o2.sh                                   | 99 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++----------------------------------------
 deploy/local/scripts/install-ops.sh                                  |  2 +-
 deploy/local/scripts/install-pf.sh                                   |  7 +++----
 deploy/local/scripts/port-forwarding/babel.conf                      |  7 -------
 deploy/local/scripts/postgresql/Dockerfile                           | 45 +++++++++++++++++++++++++++++++++++++++++++--
 deploy/local/scripts/postgresql/build.sh                             |  5 +++--
 deploy/local/setup.sh                                                |  5 +++++
 deploy/pg-bench.sh                                                   | 21 +++++++++++++++++++++
 sandbox                                                              |  2 +-
 16 files changed, 201 insertions(+), 72 deletions(-)
 create mode 100755 deploy/pg-bench.sh
git submodule update
Submodule path 'agent': checked out '6576acc51bd66181e8050299c5f8c9fb46f2066a'
Submodule path 'ai-proxy': checked out '032500b5beebd20da9a56e0f63e25cf8364a1a14'
Submodule path 'sandbox': checked out 'afa4c6ed10cab58a830d32c4e9576feaf176722a'
make install-app
Services run locally: agent

 ✔ Preload service images, elapsed 10m 21s
Target cluster 'https://0.0.0.0:40180' (nodes: babelcloud-control-plane)

@@ update deployment/babel-agent (apps/v1) namespace: babel-system @@
  ...
647,647           - name: SANDBOX_IMAGE
648     -           value: ghcr.io/babelcloud/babel-sandbox:2409d88
    648 +           value: ghcr.io/babelcloud/babel-sandbox:afa4c6e
649,649           - name: SANDBOX_NODE_GROUP
650,650             value: ""
  ...
725,725                 name: babel-infra-secret
726     -         image: ghcr.io/babelcloud/babel-agent:f09b608
    726 +         image: ghcr.io/babelcloud/babel-agent:6576acc
727,727           imagePullPolicy: IfNotPresent
728,728           livenessProbe:
@@ update deployment/babel-ai-proxy (apps/v1) namespace: babel-system @@
  ...
251,251   spec:
252     -   progressDeadlineSeconds: 600
253,252     replicas: 1
254     -   revisionHistoryLimit: 10
255,253     selector:
256,254       matchLabels:
  ...
258,256         module: babel-ai-proxy
259     -   strategy:
260     -     rollingUpdate:
261     -       maxSurge: 25%
262     -       maxUnavailable: 25%
263     -     type: RollingUpdate
264,257     template:
265,258       metadata:
266     -       creationTimestamp: null
267,259         labels:
268,260           kapp.k14s.io/app: "1721490507501923000"
  ...
301,293           - name: DEFAULT_KEY_PROVIDER
302     -           value: OpenAI
    294 +           value: Azure
303,295           - name: RABBITMQ_USERNAME
304,296             valueFrom:
  ...
338,330           - name: NODE_OPTIONS
339     -         image: ghcr.io/babelcloud/babel-ai-proxy:c41650e
    331 +           value: ""
    332 +         image: ghcr.io/babelcloud/babel-ai-proxy:032500b
340,333           imagePullPolicy: IfNotPresent
341,334           livenessProbe:
  ...
344,337             periodSeconds: 10
345     -           successThreshold: 1
346,338             tcpSocket:
347,339               port: 3007
  ...
353,345             periodSeconds: 10
354     -           successThreshold: 1
355,346             tcpSocket:
356,347               port: 3007
357,348             timeoutSeconds: 3
358     -         resources: {}
359     -         terminationMessagePath: /dev/termination-log
360     -         terminationMessagePolicy: File
361     -       dnsPolicy: ClusterFirst
362,349         imagePullSecrets:
363,350         - name: regcred
364     -       restartPolicy: Always
365     -       schedulerName: default-scheduler
366     -       securityContext: {}
367     -       terminationGracePeriodSeconds: 30
    351 +       nodeSelector: null
368,352
@@ update deployment/babel-controller (apps/v1) namespace: babel-system @@
  ...
535,535           - name: BABELCLOUD_REVISION
536     -           value: fef8ef04af6b0e882c4525136fcfbb3e7b4baab8
    536 +           value: af00478364b6431ef7c7d61cc73110e47d53232c
537,537           - name: BABELCLOUD_ENVIRONMENT
538,538             valueFrom:
@@ update daemonset/image-keeper (apps/v1) namespace: babel-tenant @@
  ...
 94, 94         containers:
 95     -       - image: ghcr.io/babelcloud/babel-sandbox:2409d88
     95 +       - image: ghcr.io/babelcloud/babel-sandbox:afa4c6e
 96, 96           name: sandbox-image-keeper
 97, 97         dnsConfig:
@@ update service/babel-toolbox (v1) namespace: babel-tenant @@
  ...
  2,  2   metadata:
  3     -   annotations: {}
  4,  3     creationTimestamp: "2024-07-20T15:48:28Z"
  5,  4     labels:
  ...
 54, 53     clusterIP: 10.96.141.65
 55     -   clusterIPs:
 56     -   - 10.96.141.65
 57     -   internalTrafficPolicy: Cluster
 58     -   ipFamilies:
 59     -   - IPv4
 60     -   ipFamilyPolicy: SingleStack
 61, 54     ports:
 62     -   - name: port0
 63     -     port: 3010
 64     -     protocol: TCP
 65     -     targetPort: 37353
     55 +   - port: 3010
 66, 56     selector:
 67     -     kwt.cppforlife.com/net: "true"
 68     -   sessionAffinity: None
     57 +     kapp.k14s.io/app: "1721490507501923000"
     58 +     module: babel-toolbox
 69, 59     type: ClusterIP
 70, 60

Changes

Namespace     Name              Kind        Age  Op      Op st.  Wait to    Rs  Ri
babel-system  babel-agent       Deployment  82d  update  -       reconcile  ok  -
^             babel-ai-proxy    Deployment  82d  update  -       reconcile  ok  -
^             babel-controller  Deployment  82d  update  -       reconcile  ok  -
babel-tenant  babel-toolbox     Service     82d  update  -       reconcile  ok  -
^             image-keeper      DaemonSet   82d  update  -       reconcile  ok  -

Op:      0 create, 0 delete, 5 update, 0 noop, 0 exists
Wait to: 5 reconcile, 0 delete, 0 noop

11:35:34AM: ---- applying 3 changes [0/5 done] ----
11:35:34AM: update daemonset/image-keeper (apps/v1) namespace: babel-tenant
11:35:34AM: update service/babel-toolbox (v1) namespace: babel-tenant
11:35:34AM: update deployment/babel-ai-proxy (apps/v1) namespace: babel-system
11:35:34AM: ---- waiting on 3 changes [0/5 done] ----
11:35:34AM: ok: reconcile service/babel-toolbox (v1) namespace: babel-tenant
11:35:34AM: ongoing: reconcile daemonset/image-keeper (apps/v1) namespace: babel-tenant
11:35:34AM:  ^ Waiting for generation 6 to be observed
11:35:34AM:  L ok: waiting on pod/image-keeper-5qv2s (v1) namespace: babel-tenant
11:35:34AM: ongoing: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
11:35:34AM:  ^ Waiting for generation 30 to be observed
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-f77d895f (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-f4fb44f78 (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-cdbf94b64 (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-847ffd96f4 (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-778f85595 (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-698f94f8b5 (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-6864ff9588 (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-6667cb9cc5 (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-64fd6dc7c8 (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-594ddc876b (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-59465748f9 (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-584475f79f (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on pod/babel-ai-proxy-6864ff9588-7pj42 (v1) namespace: babel-system
11:35:34AM: ---- waiting on 2 changes [1/5 done] ----
11:35:34AM: ongoing: reconcile daemonset/image-keeper (apps/v1) namespace: babel-tenant
11:35:34AM:  ^ Waiting for 1 updated pods to be scheduled
11:35:34AM:  L ongoing: waiting on pod/image-keeper-5qv2s (v1) namespace: babel-tenant
11:35:34AM:     ^ Deleting
11:35:34AM: ongoing: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
11:35:34AM:  ^ Waiting for generation 30 to be observed
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-f77d895f (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-f4fb44f78 (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-cdbf94b64 (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-847ffd96f4 (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-778f85595 (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-698f94f8b5 (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-6864ff9588 (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-6667cb9cc5 (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-64fd6dc7c8 (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-594ddc876b (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-59465748f9 (apps/v1) namespace: babel-system
11:35:34AM:  L ok: waiting on replicaset/babel-ai-proxy-584475f79f (apps/v1) namespace: babel-system
11:35:34AM:  L ongoing: waiting on pod/babel-ai-proxy-698f94f8b5-6pnmq (v1) namespace: babel-system
11:35:34AM:     ^ Pending: ContainerCreating
11:35:34AM:  L ok: waiting on pod/babel-ai-proxy-6864ff9588-7pj42 (v1) namespace: babel-system
11:35:37AM: ok: reconcile daemonset/image-keeper (apps/v1) namespace: babel-tenant
11:35:37AM: ongoing: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
11:35:37AM:  ^ Waiting for 1 unavailable replicas
11:35:37AM:  L ok: waiting on replicaset/babel-ai-proxy-f77d895f (apps/v1) namespace: babel-system
11:35:37AM:  L ok: waiting on replicaset/babel-ai-proxy-f4fb44f78 (apps/v1) namespace: babel-system
11:35:37AM:  L ok: waiting on replicaset/babel-ai-proxy-cdbf94b64 (apps/v1) namespace: babel-system
11:35:37AM:  L ok: waiting on replicaset/babel-ai-proxy-847ffd96f4 (apps/v1) namespace: babel-system
11:35:37AM:  L ok: waiting on replicaset/babel-ai-proxy-778f85595 (apps/v1) namespace: babel-system
11:35:37AM:  L ok: waiting on replicaset/babel-ai-proxy-698f94f8b5 (apps/v1) namespace: babel-system
11:35:37AM:  L ok: waiting on replicaset/babel-ai-proxy-6864ff9588 (apps/v1) namespace: babel-system
11:35:37AM:  L ok: waiting on replicaset/babel-ai-proxy-6667cb9cc5 (apps/v1) namespace: babel-system
11:35:37AM:  L ok: waiting on replicaset/babel-ai-proxy-64fd6dc7c8 (apps/v1) namespace: babel-system
11:35:37AM:  L ok: waiting on replicaset/babel-ai-proxy-594ddc876b (apps/v1) namespace: babel-system
11:35:37AM:  L ok: waiting on replicaset/babel-ai-proxy-59465748f9 (apps/v1) namespace: babel-system
11:35:37AM:  L ok: waiting on replicaset/babel-ai-proxy-584475f79f (apps/v1) namespace: babel-system
11:35:37AM:  L ongoing: waiting on pod/babel-ai-proxy-698f94f8b5-6pnmq (v1) namespace: babel-system
11:35:37AM:     ^ Condition Ready is not True (False)
11:35:37AM:  L ok: waiting on pod/babel-ai-proxy-6864ff9588-7pj42 (v1) namespace: babel-system
11:35:37AM: ---- waiting on 1 changes [2/5 done] ----
11:35:46AM: ok: reconcile deployment/babel-ai-proxy (apps/v1) namespace: babel-system
11:35:46AM: ---- applying 1 changes [3/5 done] ----
11:35:47AM: update deployment/babel-agent (apps/v1) namespace: babel-system
11:35:47AM: ---- waiting on 1 changes [3/5 done] ----
11:35:48AM: ongoing: reconcile deployment/babel-agent (apps/v1) namespace: babel-system
11:35:48AM:  ^ Waiting for generation 68 to be observed
11:35:48AM:  L ok: waiting on replicaset/babel-agent-85f977c9cd (apps/v1) namespace: babel-system
11:35:48AM:  L ok: waiting on replicaset/babel-agent-85bcbc4d4 (apps/v1) namespace: babel-system
11:35:48AM:  L ok: waiting on replicaset/babel-agent-85b7978cb7 (apps/v1) namespace: babel-system
11:35:48AM:  L ok: waiting on replicaset/babel-agent-85b4578ddd (apps/v1) namespace: babel-system
11:35:48AM:  L ok: waiting on replicaset/babel-agent-7c667b954 (apps/v1) namespace: babel-system
11:35:48AM:  L ok: waiting on replicaset/babel-agent-764ddb747f (apps/v1) namespace: babel-system
11:35:48AM:  L ok: waiting on replicaset/babel-agent-74dfdb4d67 (apps/v1) namespace: babel-system
11:35:48AM:  L ok: waiting on replicaset/babel-agent-6f9c9dbdcb (apps/v1) namespace: babel-system
11:35:48AM:  L ok: waiting on replicaset/babel-agent-6567977887 (apps/v1) namespace: babel-system
11:35:48AM:  L ok: waiting on replicaset/babel-agent-5cb47f8799 (apps/v1) namespace: babel-system
11:35:48AM:  L ok: waiting on replicaset/babel-agent-545b76cf8f (apps/v1) namespace: babel-system
11:35:51AM: ok: reconcile deployment/babel-agent (apps/v1) namespace: babel-system
11:35:51AM: ---- applying 1 changes [4/5 done] ----
11:35:52AM: update deployment/babel-controller (apps/v1) namespace: babel-system
11:35:52AM: ---- waiting on 1 changes [4/5 done] ----
11:35:52AM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
11:35:52AM:  ^ Waiting for generation 72 to be observed
11:35:52AM:  L ok: waiting on replicaset/babel-controller-f966bf8f8 (apps/v1) namespace: babel-system
11:35:52AM:  L ok: waiting on replicaset/babel-controller-cb646cbdd (apps/v1) namespace: babel-system
11:35:52AM:  L ok: waiting on replicaset/babel-controller-9bfb8787b (apps/v1) namespace: babel-system
11:35:52AM:  L ok: waiting on replicaset/babel-controller-7f4678b6 (apps/v1) namespace: babel-system
11:35:52AM:  L ok: waiting on replicaset/babel-controller-7c66594978 (apps/v1) namespace: babel-system
11:35:52AM:  L ok: waiting on replicaset/babel-controller-795bfc48fc (apps/v1) namespace: babel-system
11:35:52AM:  L ok: waiting on replicaset/babel-controller-76d854d666 (apps/v1) namespace: babel-system
11:35:52AM:  L ok: waiting on replicaset/babel-controller-6fb6456c86 (apps/v1) namespace: babel-system
11:35:52AM:  L ok: waiting on replicaset/babel-controller-68cf94ff85 (apps/v1) namespace: babel-system
11:35:52AM:  L ok: waiting on replicaset/babel-controller-6789b45f9d (apps/v1) namespace: babel-system
11:35:52AM:  L ok: waiting on replicaset/babel-controller-64f84fd89d (apps/v1) namespace: babel-system
11:35:52AM:  L ok: waiting on replicaset/babel-controller-5c6fcb94c (apps/v1) namespace: babel-system
11:35:52AM:  L ongoing: waiting on pod/babel-controller-76d854d666-pxvzp (v1) namespace: babel-system
11:35:52AM:     ^ Pending: PodInitializing
11:35:52AM:  L ok: waiting on pod/babel-controller-68cf94ff85-nhs7c (v1) namespace: babel-system
11:35:55AM: ongoing: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
11:35:55AM:  ^ Waiting for 1 unavailable replicas
11:35:55AM:  L ok: waiting on replicaset/babel-controller-f966bf8f8 (apps/v1) namespace: babel-system
11:35:55AM:  L ok: waiting on replicaset/babel-controller-cb646cbdd (apps/v1) namespace: babel-system
11:35:55AM:  L ok: waiting on replicaset/babel-controller-9bfb8787b (apps/v1) namespace: babel-system
11:35:55AM:  L ok: waiting on replicaset/babel-controller-7f4678b6 (apps/v1) namespace: babel-system
11:35:55AM:  L ok: waiting on replicaset/babel-controller-7c66594978 (apps/v1) namespace: babel-system
11:35:55AM:  L ok: waiting on replicaset/babel-controller-795bfc48fc (apps/v1) namespace: babel-system
11:35:55AM:  L ok: waiting on replicaset/babel-controller-76d854d666 (apps/v1) namespace: babel-system
11:35:55AM:  L ok: waiting on replicaset/babel-controller-6fb6456c86 (apps/v1) namespace: babel-system
11:35:55AM:  L ok: waiting on replicaset/babel-controller-68cf94ff85 (apps/v1) namespace: babel-system
11:35:55AM:  L ok: waiting on replicaset/babel-controller-6789b45f9d (apps/v1) namespace: babel-system
11:35:55AM:  L ok: waiting on replicaset/babel-controller-64f84fd89d (apps/v1) namespace: babel-system
11:35:55AM:  L ok: waiting on replicaset/babel-controller-5c6fcb94c (apps/v1) namespace: babel-system
11:35:55AM:  L ongoing: waiting on pod/babel-controller-76d854d666-pxvzp (v1) namespace: babel-system
11:35:55AM:     ^ Condition Ready is not True (False)
11:35:55AM:  L ok: waiting on pod/babel-controller-68cf94ff85-nhs7c (v1) namespace: babel-system
11:36:22AM: ok: reconcile deployment/babel-controller (apps/v1) namespace: babel-system
11:36:22AM: ---- applying complete [5/5 done] ----
11:36:22AM: ---- waiting complete [5/5 done] ----

Succeeded
 ➜ Setup port forwarding...
Force restart or not running process found, clean-up kwt-net pod...
Clean-up krelay-server pod...
No proxy needed, you are outside the wall.
Stopping `supervisor`... (might take a while)
==> Successfully stopped `supervisor` (label: homebrew.mxcl.supervisor)
 ✔ Port forwarding completed, elapsed 7.182s
 ✔ Installed Babel App, elapsed 11m 21s
make secret
Choose a secret type to update:
1) AWS Secrets Manager
2) Kubernetes Configmap and Secret
3) Clean local secrets cache
4) Provide an AI Key
#? 2

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".

Unable to locate credentials. You can configure credentials by running "aws configure".
 ➜ Creating configmap and secret ...
 ➜ Create configmap babel-infra-config for namespace babel-system ...
configmap/babel-infra-config not labeled
 ➜ Create secret babel-infra-secret for namespace babel-system ...
diff -N - /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/LIVE-1044564908/v1.Secret.babel-system.babel-infra-secret /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/MERGED-2477780850/v1.Secret.babel-system.babel-infra-secret
--- /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/LIVE-1044564908/v1.Secret.babel-system.babel-infra-secret	2024-10-10 12:31:28
+++ /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/MERGED-2477780850/v1.Secret.babel-system.babel-infra-secret	2024-10-10 12:31:28
@@ -1,7 +1,7 @@
 apiVersion: v1
 data:
   anthropic.apikeys: '***'
-  azure.apikeys: '*** (before)'
+  azure.apikeys: '*** (after)'
   email.password: '***'
   fluid.access_key: '***'
   fluid.azure.client_secret: '***'
Do you want to apply these changes? (Y/n) y
y
secret/babel-infra-secret configured
secret/babel-infra-secret not labeled
 ➜ Create configmap babel-infra-config for namespace babel-ops ...
configmap/babel-infra-config not labeled
 ➜ Create secret babel-infra-secret for namespace babel-ops ...
diff -N - /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/LIVE-1701036591/v1.Secret.babel-ops.babel-infra-secret /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/MERGED-165729265/v1.Secret.babel-ops.babel-infra-secret
--- /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/LIVE-1701036591/v1.Secret.babel-ops.babel-infra-secret	2024-10-10 12:31:34
+++ /var/folders/fh/q56l8swn2m7fq4gghnrb_2h40000gn/T/MERGED-165729265/v1.Secret.babel-ops.babel-infra-secret	2024-10-10 12:31:34
@@ -1,7 +1,7 @@
 apiVersion: v1
 data:
   anthropic.apikeys: '***'
-  azure.apikeys: '*** (before)'
+  azure.apikeys: '*** (after)'
   email.password: '***'
   fluid.access_key: '***'
   fluid.azure.client_secret: '***'
Do you want to apply these changes? (Y/n) y
y
secret/babel-infra-secret configured
secret/babel-infra-secret not labeled
 ➜ Create secret babel-oauth-secret...
secret/babel-oauth-secret not labeled
 ➜ Create secret regcred...
secret/regcred configured
secret/regcred configured
 ➜ Create secret babel-runtime-webhook-issuer-keypair...
 ✔ Created configmap and secret, elapsed 12.845s

----------------- Log End -----------------

What should I do if there is an update of babel-frontend? Command only, no explanation.

## Response

```bash
git pull origin main
make update-frontend
kubectl rollout restart deployment/babel-frontend -n babel-tenant
```

